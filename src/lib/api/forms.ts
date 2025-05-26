import axios from 'axios'

/**
 * Upload a logo for a form
 */
export async function uploadFormLogo(file: File, formId: string, token: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`/api/forms/${formId}/logo`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.data) {
    throw new Error('Failed to upload logo')
  }

  return response.data.logoUrl
}
