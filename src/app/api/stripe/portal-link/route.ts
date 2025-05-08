import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// API endpoint to create a Stripe portal link
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Make request to internal API
    const response = await axios.post(
      `${process.env.API_BASE_URL}/api/v1/stripe/portal-link`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error creating portal link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
