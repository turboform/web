import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';

export const supabaseApiClient = (authToken: string) =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    }
  )
