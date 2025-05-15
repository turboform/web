import axios from 'axios'

export async function linkAnonymousAccountToUser(
  anonymousUserId: string,
  targetUserId: string,
  authToken: string | undefined
) {
  try {
    const response = await axios.post(
      '/api/auth/link-anonymous-data',
      {
        anonymousUserId,
        targetUserId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    )

    return { success: true }
  } catch (error) {
    console.error('Error transferring anonymous data:', error)
    return { success: false, error: 'Error transferring anonymous data' }
  }
}
