import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Forward the request to the worker endpoint
    const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/auth/link-anonymous-data`, await req.json(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to link anonymous data:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
