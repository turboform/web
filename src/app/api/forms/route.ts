import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { title, description, schema } = await req.json();

    // Authenticate the user (will now work with anonymous users too)
    const { user, supabase, error } = await authenticateUser();

    // If authentication failed, return the error response
    if (error) {
      return error;
    }

    // We no longer need to check if user exists, as anonymous users are valid
    // Insert form into database
    const { data, error: dbError } = await supabase
      .from('forms')
      .insert({
        user_id: user!.id,
        title,
        description,
        schema
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving form:', dbError);
      return NextResponse.json(
        { error: 'Failed to save form' },
        { status: 500 }
      );
    }

    return NextResponse.json({ form: data });
  } catch (error) {
    console.error('Error saving form:', error);
    return NextResponse.json(
      { error: 'Failed to save form' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate the user
    const { user, supabase, error } = await authenticateUser();

    // If authentication failed, return the error response
    if (error) {
      return error;
    }

    // Get forms for the user
    const { data: allForms, error: dbError } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('Error getting forms:', dbError);
      return NextResponse.json(
        { error: 'Failed to get forms' },
        { status: 500 }
      );
    }

    // Filter forms to show only the current user's forms
    const userForms = user ? allForms.filter(form => form.user_id === user.id) : [];

    // Get response counts for each form
    const formsWithResponseCounts = await Promise.all(
      userForms.map(async (form) => {
        const { count, error: countError } = await supabase
          .from('form_responses')
          .select('*', { count: 'exact', head: true })
          .eq('form_id', form.id);
          
        if (countError) {
          console.error('Error counting responses:', countError);
          return { ...form, responseCount: 0 };
        }
        
        return { ...form, responseCount: count || 0 };
      })
    );

    return NextResponse.json({ forms: formsWithResponseCounts });
  } catch (error) {
    console.error('Error getting forms:', error);
    return NextResponse.json(
      { error: 'Failed to get forms' },
      { status: 500 }
    );
  }
}
