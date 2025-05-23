import { supabaseBrowserClient } from './browser'

export const LOGOS_BUCKET = 'form-logos'

/**
 * Uploads a logo file to Supabase storage
 * @param file The file to upload
 * @param userId The ID of the user uploading the file
 * @param formId The ID of the form the logo is for
 * @returns The URL of the uploaded file
 */
export const uploadLogo = async (file: File, userId: string, formId: string): Promise<string> => {
  try {
    const filePath = `${userId}/${formId}/${file.name}`
    
    const { data, error } = await supabaseBrowserClient.storage
      .from(LOGOS_BUCKET)
      .upload(filePath, file, {
        upsert: true, // Replace if exists
        cacheControl: '3600'
      })
    
    if (error) {
      console.error('Error uploading logo:', error)
      throw error
    }
    
    const { data: urlData } = supabaseBrowserClient.storage
      .from(LOGOS_BUCKET)
      .getPublicUrl(data.path)
    
    return urlData.publicUrl
  } catch (error) {
    console.error('Error in uploadLogo:', error)
    throw error
  }
}

/**
 * Deletes a logo file from Supabase storage
 * @param url The URL of the file to delete
 */
export const deleteLogo = async (url: string): Promise<void> => {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === LOGOS_BUCKET)
    
    if (bucketIndex === -1) {
      throw new Error('Invalid logo URL')
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/')
    
    const { error } = await supabaseBrowserClient.storage
      .from(LOGOS_BUCKET)
      .remove([filePath])
    
    if (error) {
      console.error('Error deleting logo:', error)
      throw error
    }
  } catch (error) {
    console.error('Error in deleteLogo:', error)
    throw error
  }
}
