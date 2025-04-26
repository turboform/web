import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/forms/submit`, body)

    if (!response.data.success) {
      console.error('Error submitting form response:', response.data)
      return NextResponse.json(
        { success: false, message: 'Failed to submit form response' },
        { status: response.status }
      )
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error in form submission API route:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
