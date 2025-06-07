import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export const runtime = 'edge'

// Helper function to create HMAC using Web Crypto API
async function createHmac(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const dataToSign = encoder.encode(data)
  
  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  // Sign the data
  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    dataToSign
  )
  
  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const timestamp = Date.now().toString()
    const sharedSecret = process.env.FORM_SUBMISSION_SECRET

    if (!sharedSecret) {
      console.error('FORM_SUBMISSION_SECRET is not defined')
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 })
    }

    // Generate a signature using HMAC-SHA256
    // The signature is based on the form ID, timestamp, and shared secret
    const dataToSign = `${body.formId}:${timestamp}:${sharedSecret}`
    const signature = await createHmac(sharedSecret, dataToSign)

    // Forward the request to the worker endpoint with the security headers
    console.log('Timestamp:', timestamp)
    console.log('Signature:', signature)
    const response = await axios.post(`${process.env.API_BASE_URL}/api/v1/form/submit`, body, {
      headers: {
        'Content-Type': 'application/json',
        'X-Turboform-Timestamp': timestamp,
        'X-Turboform-Signature': signature,
      },
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Error proxying request to submit form:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
