import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id } = await params

    const response = await axios.put(`${process.env.API_BASE_URL}/api/v1/integrations/${id}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error updating integration:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to update integration' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const response = await axios.delete(`${process.env.API_BASE_URL}/api/v1/integrations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error deleting integration:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to delete integration' },
      { status: error.response?.status || 500 }
    )
  }
}
