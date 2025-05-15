import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Get the request body
    const body = await req.json()

    // Forward the request to the worker endpoint
    const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/form/create`, body, {
      headers: {
        Authorization: authorization,
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to create form:', error)
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Forward the request to the worker endpoint
    const response = await axios.get(`${process.env.API_BASE_URL}/api/v1/forms`, {
      headers: {
        Authorization: authorization,
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to get forms:', error)
    return NextResponse.json({ error: 'Failed to get forms' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Get the request body
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 })
    }

    // Forward the request to the worker endpoint
    const response = await axios.put(`${process.env.API_BASE_URL}/api/v1/form/${id}`, body, {
      headers: {
        Authorization: authorization,
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to update form:', error)
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 })
  }
}
