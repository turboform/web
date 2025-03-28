import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

// Helper function to generate a random short ID
function generateShortId(length = 8): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, schema, expires_at } = await req.json();

    // Authenticate the user (will now work with anonymous users too)
    const { user, supabase, error } = await authenticateUser();

    // If authentication failed, return the error response
    if (error) {
      return error;
    }

    // Generate a unique short ID
    const short_id = generateShortId();

    // Insert form into database
    const { data, error: dbError } = await supabase
      .from('forms')
      .insert({
        user_id: user!.id,
        title,
        description,
        schema,
        short_id,
        expires_at: expires_at || null
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
    const userForms = allForms?.filter(form => form.user_id === user!.id) || [];

    // Get response counts for each form
    const formIds = userForms.map(form => form.id);
    
    if (formIds.length > 0) {
      const { data: responseData, error: responseError } = await supabase
        .from('form_responses')
        .select('form_id, count')
        .in('form_id', formIds)
        .select('form_id')
        .then(({ data, error }) => {
          if (error) return { data: null, error };
          
          // Count responses for each form
          const counts: Record<string, number> = {};
          data?.forEach((row: any) => {
            counts[row.form_id] = (counts[row.form_id] || 0) + 1;
          });
          
          return { data: counts, error: null };
        });

      if (!responseError && responseData) {
        // Add response counts to forms
        userForms.forEach(form => {
          form.responseCount = responseData[form.id] || 0;
        });
      }
    }

    return NextResponse.json({ forms: userForms });
  } catch (error) {
    console.error('Error getting forms:', error);
    return NextResponse.json({ error: 'Failed to get forms' }, { status: 500 });
  }
}
