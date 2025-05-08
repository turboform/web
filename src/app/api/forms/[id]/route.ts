import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

// PUT endpoint to update a form
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Get the form ID from the params
    const formId = (await params).id
    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 })
    }

    // Forward the request to the worker endpoint
    const response = await axios.put(`${process.env.API_BASE_URL}/api/v1/form/${formId}`, await req.json(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorization,
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to update form:', error)
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 })
  }
}

// GET endpoint to retrieve a single form
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Get the form ID from the params
    const formId = (await params).id
    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 })
    }

    // Forward the request to the worker endpoint
    const response = await axios.get(`${process.env.API_BASE_URL}/api/v1/form/${formId}`, {
      headers: {
        Authorization: authorization,
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to get form:', error)
    return NextResponse.json({ error: 'Failed to get form' }, { status: 500 })
  }
}
