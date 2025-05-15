import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const response = await axios.get(`${process.env.API_URL}/api/v1/form/${id}/integrations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error fetching form integrations:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch form integrations' },
      { status: error.response?.status || 500 }
    )
  }
}
