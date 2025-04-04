import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Authenticate the user using the project's auth function
    const { user, supabase, error } = await authenticateUser(token)

    // If authentication failed, return the error response
    if (error) {
      return error
    }

    // Get the form ID from the params
    const formId = req.nextUrl.searchParams.get('id')
    if (!formId) {
      return NextResponse.json({ error: 'Form ID is required' }, { status: 400 })
    }

    // Verify that the user has access to this form
    const { data: formData, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('user_id', user!.id)
      .single()

    if (formError || !formData) {
      return NextResponse.json({ error: 'Form not found or you do not have access to this form' }, { status: 404 })
    }

    // Get responses for this form
    const { data: responses, error: responsesError } = await supabase
      .from('form_responses')
      .select('*')
      .eq('form_id', formId)
      .order('created_at', { ascending: false })

    if (responsesError) {
      console.error('Error fetching responses:', responsesError)
      return NextResponse.json({ error: 'Failed to load form responses' }, { status: 500 })
    }

    return NextResponse.json({ responses })
  } catch (error) {
    console.error('Error in responses API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
