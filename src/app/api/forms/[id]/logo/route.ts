import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 })
    }
    
    const workerFormData = new FormData()
    workerFormData.append('file', file)
    
    const response = await axios.post(
      `${process.env.API_BASE_URL}/api/v1/form/${formId}/logo`,
      workerFormData,
      {
        headers: {
          Authorization: authorization,
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to upload logo:', error)
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 })
  }
}
