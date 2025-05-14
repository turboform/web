import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const response = await axios.post(
      `${process.env.API_URL}/api/v1/integrations`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error creating integration:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to create integration' },
      { status: error.response?.status || 500 }
    )
  }
}
