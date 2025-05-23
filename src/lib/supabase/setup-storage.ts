import { supabaseBrowserClient } from './browser'
import { LOGOS_BUCKET } from './storage'

/**
 * Ensures that the necessary storage buckets exist
 * Call this function when the app initializes
 */
export const setupSupabaseStorage = async (): Promise<void> => {
  try {
    const { data: buckets, error } = await supabaseBrowserClient.storage.listBuckets()
    
    if (error) {
      console.error('Error checking storage buckets:', error)
      return
    }
    
    if (!buckets.find(bucket => bucket.name === LOGOS_BUCKET)) {
      const { error: createError } = await supabaseBrowserClient.storage.createBucket(LOGOS_BUCKET, {
        public: true, // Public bucket so form logos can be accessed without auth
        fileSizeLimit: 2097152, // 2MB limit
      })
      
      if (createError) {
        console.error('Error creating logos bucket:', createError)
      }
    }
  } catch (error) {
    console.error('Error setting up Supabase storage:', error)
  }
}
