'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, Loader2, History, Trash2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  formId: string
  authToken: string
}

interface Conversation {
  id: string
  form_id: string
  title: string | null
  created_at: string
  updated_at: string
  last_message?: {
    content: string
    role: 'user' | 'assistant' | 'system'
    created_at: string
  }
}

export function ChatInterface({ formId, authToken }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Fetch conversations when history is opened
  useEffect(() => {
    if (showHistory) {
      fetchConversations()
    }
  }, [showHistory])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const fetchConversations = async () => {
    setLoadingConversations(true)
    try {
      const response = await fetch(`/api/chat/conversations/${formId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch conversations')
      }

      const data = await response.json()
      setConversations(data)
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast.error('Failed to load conversations')
    } finally {
      setLoadingConversations(false)
    }
  }

  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(`/api/chat/conversation/${convId}/messages`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load conversation')
      }

      const messages = await response.json()

      // Convert messages to the format expected by the component
      const formattedMessages: Message[] = messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
      }))

      setMessages(formattedMessages)
      setConversationId(convId)
      setShowHistory(false)
    } catch (error) {
      console.error('Error loading conversation:', error)
      toast.error('Failed to load conversation')
    }
  }

  const deleteConversation = async (convId: string) => {
    try {
      const response = await fetch(`/api/chat/conversation/${convId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete conversation')
      }

      // If we're deleting the current conversation, clear it
      if (convId === conversationId) {
        setMessages([])
        setConversationId(null)
      }

      // Refresh the conversations list
      await fetchConversations()
      toast.success('Conversation deleted')
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast.error('Failed to delete conversation')
    } finally {
      setConversationToDelete(null)
    }
  }

  const startNewConversation = () => {
    setMessages([])
    setConversationId(null)
    setShowHistory(false)
    inputRef.current?.focus()
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Use EventSource for streaming when possible
      if (typeof EventSource !== 'undefined') {
        // Make a streaming request
        await handleStreamingResponse(userMessage)
      } else {
        // Fallback to regular request for browsers without EventSource
        await handleRegularResponse(userMessage)
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to send message. Please try again.')

      // Remove the user message if the request failed
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
      setInput(userMessage.content)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleStreamingResponse = async (userMessage: Message) => {
    // Create a controller to abort the fetch if needed
    const controller = new AbortController()

    // Create placeholder message for the assistant
    const assistantMessageId = `assistant-${Date.now()}`
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      // Make the POST request to initialize the stream
      const response = await fetch('/api/chat/form-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          formId,
          message: userMessage.content,
          ...(conversationId ? { conversationId } : {}),
        }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error('Stream response failed')
      }

      // Setup streaming response handling
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let streamContent = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        // Decode the stream data
        const chunk = decoder.decode(value, { stream: true })

        // Process each event in the chunk
        // More robust parsing of server-sent events
        const events = chunk.split('\n\n').filter((event) => event.trim().startsWith('data:'))

        for (const event of events) {
          try {
            // More robust JSON parsing with error handling
            const jsonStr = event.replace(/^data:\s*/, '').trim()
            // Ensure we have valid JSON before parsing
            if (!jsonStr || jsonStr === '') continue

            // Debug the received data if there are issues
            console.debug('Processing SSE data:', jsonStr)
            const data = JSON.parse(jsonStr)

            // Handle text content
            if (data.text) {
              streamContent += data.text
              setMessages((prev) =>
                prev.map((msg) => {
                  if (msg.id === assistantMessageId) {
                    return { ...msg, content: streamContent }
                  }
                  return msg
                })
              )
            }

            // Handle completion
            if (data.isComplete && data.conversationId) {
              if (!conversationId) {
                setConversationId(data.conversationId)
              }
            }
          } catch (e) {
            console.error('Error parsing stream data:', e)
          }
        }
      }
    } catch (error) {
      controller.abort()
      // Remove the assistant message if streaming failed
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId))
      throw error
    }
  }

  const handleRegularResponse = async (userMessage: Message) => {
    // Create placeholder message for the assistant
    const assistantMessageId = `assistant-${Date.now()}`
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])

    try {
      // Regular non-streaming request
      const response = await fetch('/api/chat/form-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          formId,
          message: userMessage.content,
          ...(conversationId ? { conversationId } : {}),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Update the assistant message with the response
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === assistantMessageId) {
            return { ...msg, content: data.message || data.text || 'Sorry, I could not generate a response.' }
          }
          return msg
        })
      )

      // Set conversation ID if this is a new conversation
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId)
      }
    } catch (error) {
      // Remove the assistant message if the request failed
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId))
      throw error
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Chat with Form Responses</CardTitle>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={startNewConversation} className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              New Chat
            </Button>
          )}
          <Sheet open={showHistory} onOpenChange={setShowHistory}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <History className="w-3 h-3 mr-1" />
                History
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chat History</SheetTitle>
                <SheetDescription>Your previous conversations about this form</SheetDescription>
              </SheetHeader>
              <ScrollArea className="mt-6 h-[calc(100vh-180px)]">
                <div className="px-4 space-y-2">
                  {loadingConversations && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  )}
                  {!loadingConversations && conversations.length === 0 && (
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                  )}
                  {!loadingConversations &&
                    conversations.map((conv) => (
                      <div key={conv.id} className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer group">
                        <div onClick={() => loadConversation(conv.id)} className="flex-1">
                          <h4 className="font-medium text-sm">{conv.title || 'Untitled Conversation'}</h4>
                          {conv.last_message && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {conv.last_message.content}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(conv.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity mt-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setConversationToDelete(conv.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 h-full overflow-auto">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-sm">Ask questions about your form responses</p>
                <p className="text-xs mt-2">
                  I can help you analyze patterns, find insights, and answer questions about your data.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2 max-w-[80%]',
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    {message.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="markdown text-sm prose prose-sm dark:prose-invert max-w-none overflow-auto">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                      </div>
                    )}
                    <p
                      className={cn(
                        'text-xs mt-1 opacity-70',
                        message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask about your form responses..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={isLoading || !input.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={!!conversationToDelete} onOpenChange={() => setConversationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => conversationToDelete && deleteConversation(conversationToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
