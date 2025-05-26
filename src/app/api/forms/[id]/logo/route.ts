import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    const formId = (await params).id
    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 })
    }

    const formData = await req.formData()
    // Use fetch instead of axios for streaming FormData in Next.js API routes
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/form/${formId}/logo`, {
      method: 'POST',
      headers: {
        Authorization: authorization,
      },
      body: formData,
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to upload logo:', error)
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
  }
}
