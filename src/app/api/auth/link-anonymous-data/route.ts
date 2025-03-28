import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { anonymousUserId, targetUserId } = await req.json();

    if (!anonymousUserId || !targetUserId) {
      return NextResponse.json({ error: 'Missing required user IDs' }, { status: 400 });
    }

    // Transfer all forms from the anonymous user to the registered user
    const { error: transferError } = await supabaseAdminClient
      .from('forms')
      .update({ user_id: targetUserId })
      .eq('user_id', anonymousUserId);

    if (transferError) {
      console.error('Error transferring forms:', transferError);
      return NextResponse.json({ error: 'Failed to transfer forms' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in link-anonymous-data:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
