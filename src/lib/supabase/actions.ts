'use server';

import { revalidatePath } from 'next/cache';
import { cache } from 'react';
import { supabaseAdminClient } from './admin';

export type FormData = {
  id: string;
  title: string;
  description: string;
  schema: any[];
  created_at: string;
  user_id: string;
};

// Use cache to prevent redundant fetches during server rendering cycle
export const getFormById = cache(async (formId: string): Promise<FormData | null> => {
  try {
    const { data, error } = await supabaseAdminClient
      .from('forms')
      .select('*')
      .eq('id', formId)
      .single();

    if (error) {
      console.error('Error fetching form:', error);
      return null;
    }

    return data as FormData;
  } catch (error) {
    console.error('Error in getFormById:', error);
    return null;
  }
});

export async function submitFormResponse(formId: string, responses: Record<string, any>) {
  try {
    const { error } = await supabaseAdminClient
      .from('form_responses')
      .insert({
        form_id: formId,
        responses
      });

    if (error) {
      throw error;
    }

    // Invalidate the cache for this form page
    revalidatePath(`/form/${formId}`);

    return { success: true };
  } catch (error) {
    console.error('Error submitting form response:', error);
    return { success: false, error };
  }
}
