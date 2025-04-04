import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/supabase/server'

export const runtime = 'edge'

// PUT endpoint to update a form
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Authenticate the user
    const { user, supabase, error } = await authenticateUser(token)

    // If authentication failed, return the error response
    if (error) {
      return error
    }

    // Get the form data from the request
    const formId = req.nextUrl.searchParams.get('id') as string
    const { title, description, schema, expires_at } = await req.json()

    // Verify the user owns this form
    const { data: existingForm, error: verifyError } = await supabase
      .from('forms')
      .select('id, user_id')
      .eq('id', formId)
      .single()

    if (verifyError || !existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    if (existingForm.user_id !== user!.id) {
      return NextResponse.json({ error: 'You do not have permission to update this form' }, { status: 403 })
    }

    // Update the form
    const { data, error: updateError } = await supabase
      .from('forms')
      .update({
        title,
        description,
        schema,
        expires_at: expires_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', formId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating form:', updateError)
      return NextResponse.json({ error: 'Failed to update form' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      form: data,
    })
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 })
  }
}

// GET endpoint to retrieve a single form
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
    }

    // Authenticate the user
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

    // Get the form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', formId)
      .eq('user_id', user!.id)
      .single()

    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Get response count
    const { count, error: countError } = await supabase
      .from('form_responses')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formId)

    if (countError) {
      console.error('Error counting responses:', countError)
    } else {
      ;(form as any).responseCount = count || 0 // TODO: fix this hack
    }

    return NextResponse.json({ form })
  } catch (error) {
    console.error('Error getting form:', error)
    return NextResponse.json({ error: 'Failed to get form' }, { status: 500 })
  }
}
