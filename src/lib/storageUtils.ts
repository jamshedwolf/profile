import { supabase } from "@/integrations/supabase/client";
import { STORAGE_CONFIG } from "@/config/constants";

/**
 * Checks if a storage bucket exists
 */
export async function checkBucketExists(bucketName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Error checking buckets:", error);
      return false;
    }
    return data?.some(bucket => bucket.name === bucketName) ?? false;
  } catch (error) {
    console.error("Error checking bucket existence:", error);
    return false;
  }
}

/**
 * Handles storage upload errors and provides user-friendly messages
 */
export function handleStorageError(error: any): Error {
  // Handle different error object structures
  const errorMessage = error?.message || String(error?.message || '');
  const errorType = error?.error || String(error?.error || '');
  const statusCode = error?.statusCode || error?.status || '';
  
  // Convert error to string for comprehensive checking
  const errorString = JSON.stringify(error).toLowerCase();
  
  // Check for bucket not found error - check multiple formats
  const isBucketNotFound = 
    statusCode === '404' ||
    statusCode === 404 ||
    String(statusCode) === '404' ||
    errorType === 'Bucket not found' ||
    errorType?.toLowerCase() === 'bucket not found' ||
    errorMessage?.toLowerCase().includes('bucket not found') ||
    errorMessage?.toLowerCase().includes('the resource was not found') ||
    errorMessage?.toLowerCase().includes('not found') ||
    errorString.includes('bucket not found') ||
    errorString.includes('404');
  
  if (isBucketNotFound) {
    return new Error(
      `Storage bucket "${STORAGE_CONFIG.BUCKET_NAME}" not found. ` +
      `Please create it in Supabase Dashboard → Storage → Create a new bucket named "${STORAGE_CONFIG.BUCKET_NAME}" and make it public (or set appropriate policies), then refresh this page.`
    );
  }
  
  // Check for RLS policy errors
  if (errorMessage.includes('new row violates row-level security policy') || 
      errorMessage.includes('policy') ||
      errorMessage.includes('RLS')) {
    return new Error(
      'Storage policy error. Please set up storage policies in Supabase Dashboard:\n' +
      '1. Go to Storage → Policies\n' +
      '2. Create policies for the "' + STORAGE_CONFIG.BUCKET_NAME + '" bucket\n' +
      '3. Allow authenticated users to upload/read files'
    );
  }
  
  // Return original error if we can't categorize it
  return error instanceof Error ? error : new Error(errorMessage || 'Storage operation failed');
}

/**
 * Uploads a file to Supabase storage with proper error handling
 */
export async function uploadToStorage(
  file: File,
  userId: string,
  bucketName: string = STORAGE_CONFIG.BUCKET_NAME
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  // Upload file
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    // Log the full error for debugging
    console.error('Storage upload error:', {
      error: uploadError,
      bucketName,
      fileName,
      errorType: typeof uploadError,
      errorKeys: Object.keys(uploadError || {}),
    });
    // Handle duplicate file error
    if (uploadError.message?.includes('duplicate')) {
      const newFileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const retryResult = await supabase.storage
        .from(bucketName)
        .upload(newFileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (retryResult.error) {
        throw handleStorageError(retryResult.error);
      }
      
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(newFileName);
      
      return urlData.publicUrl;
    }
    
    throw handleStorageError(uploadError);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(uploadData?.path || fileName);

  return urlData.publicUrl;
}

