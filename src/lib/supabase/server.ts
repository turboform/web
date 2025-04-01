import { NextResponse } from 'next/server';
import { supabaseApiClient } from './api';
import { supabaseAdminClient } from './admin';

export async function authenticateUser(token: string) {
  try {
    if (!token) {
      return {
        user: null,
        supabase: supabaseApiClient(''),
        error: NextResponse.json(
          { error: 'Unauthorized - Invalid token format' },
          { status: 401 }
        )
      };
    }

    const { data: { user }, error: userError } = await supabaseAdminClient.auth.getUser(token);

    if (userError || !user) {
      return {
        user: null,
        supabase: supabaseApiClient(''),
        error: NextResponse.json(
          { error: 'Unauthorized - Invalid user' },
          { status: 401 }
        )
      };
    }

    return { user, supabase: supabaseApiClient(token), error: null };
  } catch (error) {
    // TODO: add logging
    console.error('Authentication error:', error);
    return {
      user: null,
      supabase: supabaseApiClient(''),
      error: NextResponse.json(
        { error: 'Server error during authentication' },
        { status: 500 }
      )
    };
  }
}
