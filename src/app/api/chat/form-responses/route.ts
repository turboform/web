import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Check if the client accepts streaming
    const acceptHeader = req.headers.get('Accept')
    const isStreaming = acceptHeader === 'text/event-stream'

    const body = await req.json()

    // Set up fetch options
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    }

    // Add streaming header if client accepts streaming
    if (isStreaming) {
      ;(fetchOptions.headers as Record<string, string>)['Accept'] = 'text/event-stream'
    }

    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/chat/form-responses`, fetchOptions)

    if (!response.ok && !isStreaming) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    // Handle streaming response
    if (isStreaming && response.body) {
      return new NextResponse(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Handle regular JSON response
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
