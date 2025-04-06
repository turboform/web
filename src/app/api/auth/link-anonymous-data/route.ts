import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdminClient } from '@/lib/supabase/admin'
import { authenticateUser } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  // Check that the user is authenticated and has the right permissions
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized - Invalid token format' }, { status: 401 })
  }

  const { user, supabase, error } = await authenticateUser(token)

  // If authentication failed, return the error response
  if (error) {
    return error
  }

  try {
    const { anonymousUserId, targetUserId } = await req.json()

    if (!anonymousUserId || !targetUserId) {
      return NextResponse.json({ error: 'Missing required user IDs' }, { status: 400 })
    }

    // SECURITY CHECK: Ensure targetUserId matches the authenticated user's ID
    if (targetUserId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only transfer data to your own account' },
        { status: 403 }
      )
    }

    // SECURITY CHECK: Verify the anonymous user is actually anonymous
    const { data: anonymousUserData, error: userCheckError } =
      await supabaseAdminClient.auth.admin.getUserById(anonymousUserId)

    if (userCheckError || !anonymousUserData) {
      return NextResponse.json({ error: 'Invalid source user ID' }, { status: 400 })
    }

    // Verify the source user is actually anonymous
    if (!anonymousUserData.user?.app_metadata?.is_anonymous) {
      return NextResponse.json(
        { error: 'Unauthorized - Can only transfer data from anonymous accounts' },
        { status: 403 }
      )
    }

    // Transfer all forms from the anonymous user to the registered user
    const { error: transferError } = await supabaseAdminClient
      .from('forms')
      .update({ user_id: targetUserId })
      .eq('user_id', anonymousUserId)

    if (transferError) {
      console.error('Error transferring forms:', transferError)
      return NextResponse.json({ error: 'Failed to transfer forms' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in link-anonymous-data:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
