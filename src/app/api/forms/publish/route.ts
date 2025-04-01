import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token format' },
        { status: 401 }
      );
    }

    const { user, supabase, error } = await authenticateUser(token);

    // If authentication failed, return the error response
    if (error) {
      return error;
    }

    // Get request body
    const { formId, isPublished } = await req.json();
    
    if (!formId) {
      return NextResponse.json(
        { error: 'Form ID is required' },
        { status: 400 }
      );
    }

    // Verify form ownership
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('id')
      .eq('id', formId)
      .eq('user_id', user!.id)
      .single();

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Form not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    // Update form draft status
    const isDraft = !isPublished;
    const { data: updatedForm, error: updateError } = await supabase
      .from('forms')
      .update({ 
        is_draft: isDraft,
        updated_at: new Date().toISOString()
      })
      .eq('id', formId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating form status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update form status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      form: updatedForm 
    });
  } catch (error) {
    console.error('Error in publish form API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
