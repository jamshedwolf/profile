/**
 * Maps database/API errors to user-friendly messages
 * Prevents exposing internal schema details
 */
export const mapErrorMessage = (error: unknown): string => {
  if (!error) return 'An error occurred. Please try again later.';
  
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as { code?: string })?.code;
  
  // Map common Postgres error codes
  if (errorCode === '23505') return 'This item already exists.';
  if (errorCode === '23503') return 'Cannot complete this action due to related data.';
  if (errorCode === '42P01') return 'Database configuration error. Please contact support.';
  if (errorCode === '42501') return 'You do not have permission to perform this action.';
  if (errorCode === 'PGRST116') return 'Item not found.';
  
  // Map common error patterns (without revealing internal details)
  if (errorMessage.includes('RLS') || errorMessage.includes('row-level security')) {
    return 'Permission denied. Please ensure you are logged in.';
  }
  if (errorMessage.includes('violates')) {
    return 'Invalid data provided. Please check your input.';
  }
  if (errorMessage.includes('duplicate')) {
    return 'This item already exists.';
  }
  if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
    return 'The requested item could not be found.';
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (errorMessage.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  // Generic fallback - never expose raw error
  return 'An error occurred. Please try again later.';
};
