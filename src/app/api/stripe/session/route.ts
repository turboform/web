import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// API endpoint to create a Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token format' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Make request to internal API
    const response = await axios.post(`${process.env.API_BASE_URL}/v1/stripe/session`,
      {
        priceId: body.priceId,
        quantity: 1,
        metadata: body.metadata || {}
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

    return NextResponse.json(response.data);

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}