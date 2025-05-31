import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    // Properly destructure and await params to avoid Next.js dynamic API issues
    const { conversationId } = await params

    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/chat/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: {
        Authorization: authorization,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json({ error }, { status: response.status })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
