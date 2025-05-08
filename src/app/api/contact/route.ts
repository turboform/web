import { NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    // Get the request body
    const body = await request.json()

    // Forward the request to the workers endpoint
    const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/contact`, body)

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to contact endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
