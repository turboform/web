import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Forward the request to the worker endpoint
    const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/form/submit`, await request.json(), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to submit form:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
