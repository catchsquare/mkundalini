/**
 * Security-focused error handling utility
 * Prevents leaking internal database/system details to end users
 */

// PostgreSQL error code to user-friendly message mapping
const pgErrorMap: Record<string, string> = {
  '23505': 'This record already exists',
  '23503': 'Cannot complete this action - the record is in use by other data',
  '23502': 'A required field is missing',
  '23514': 'The value provided is not valid for this field',
  '23P01': 'Cannot delete - record is referenced by other data',
  '42P01': 'A database error occurred. Please try again.',
  '42703': 'A database error occurred. Please try again.',
  '42501': 'You do not have permission to perform this action',
  '22P02': 'Invalid data format provided',
  '22003': 'The number provided is out of range',
  '28000': 'Authentication failed',
  '28P01': 'Password authentication failed',
  'PGRST116': 'The requested record was not found',
  'PGRST301': 'You must be logged in to perform this action',
  'PGRST302': 'Your session has expired. Please log in again.',
};

// Common auth error patterns
const authErrorPatterns: Array<{ pattern: RegExp; message: string }> = [
  { pattern: /invalid.*email/i, message: 'Please enter a valid email address' },
  { pattern: /password.*short/i, message: 'Password must be at least 6 characters' },
  { pattern: /user.*not.*found/i, message: 'No account found with this email' },
  { pattern: /invalid.*credentials/i, message: 'Invalid email or password' },
  { pattern: /email.*already.*registered/i, message: 'This email is already registered' },
  { pattern: /email.*not.*confirmed/i, message: 'Please confirm your email before logging in' },
  { pattern: /rate.*limit/i, message: 'Too many attempts. Please wait a moment.' },
];

/**
 * Converts database/system errors to user-safe messages
 * Logs the original error for debugging while showing generic messages to users
 */
export function getSafeErrorMessage(error: unknown): string {
  // Log the original error for debugging (only in development or server logs)
  if (import.meta.env.DEV) {
    console.error('[DEV ERROR]', error);
  }

  // Handle null/undefined
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Extract error properties
  const errorObj = error as Record<string, unknown>;
  const code = errorObj?.code as string;
  const message = (errorObj?.message as string) || String(error);

  // Check PostgreSQL error codes first
  if (code && pgErrorMap[code]) {
    return pgErrorMap[code];
  }

  // Check for auth error patterns
  for (const { pattern, message: userMessage } of authErrorPatterns) {
    if (pattern.test(message)) {
      return userMessage;
    }
  }

  // Check for specific constraint violations with more detail
  if (message.includes('violates check constraint')) {
    if (message.includes('quantity')) {
      return 'Invalid quantity value. Please enter a positive number.';
    }
    if (message.includes('price') || message.includes('amount')) {
      return 'Invalid price or amount. Please enter a valid number.';
    }
    if (message.includes('discount')) {
      return 'Invalid discount value. Please enter a value between 0 and the subtotal.';
    }
    return 'The value you entered is not valid. Please check and try again.';
  }

  // Check for foreign key violations
  if (message.includes('foreign key constraint')) {
    return 'Cannot complete this action - the record references data that does not exist.';
  }

  // Check for unique violations
  if (message.includes('duplicate key') || message.includes('unique constraint')) {
    return 'This record already exists. Please use a different value.';
  }

  // Check for RLS policy violations
  if (message.includes('row-level security') || message.includes('RLS')) {
    return 'You do not have permission to perform this action.';
  }

  // Default safe message
  return 'An error occurred. Please try again or contact support if the problem persists.';
}

/**
 * Type guard to check if an error has a message property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}
