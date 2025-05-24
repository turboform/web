
/**
 * Upload a logo for a form
 */
export async function uploadFormLogo(file: File, formId: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`/api/forms/${formId}/logo`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to upload logo')
  }

  const data = await response.json()
  return data.logoUrl
}
