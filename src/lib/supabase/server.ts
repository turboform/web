import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE_STORAGE_KEY } from '@/lib/types/constants';
import { supabaseApiClient } from './api';
import { supabaseAdminClient } from './admin';

export async function authenticateUser() {
  try {
    const cookieStore = await cookies();
    const tokenBase64 = cookieStore.get(COOKIE_STORAGE_KEY)?.value;

    if (!tokenBase64) {
      return {
        user: null,
        supabase: supabaseApiClient(''),
        error: NextResponse.json(
          { error: 'Unauthorized - No auth token' },
          { status: 401 }
        )
      };
    }

    const tokenObject = Buffer.from(tokenBase64.replace('base64-', ''), 'base64').toString('utf-8');
    const token = JSON.parse(tokenObject)?.access_token as string;

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
