/**
 * Error Handling Utilities
 * Provides user-friendly error messages and error management
 */

/**
 * Parse and format API errors
 * @param {Error} error - Axios error object
 * @returns {Object} Formatted error with message and details
 */
export function handleAPIError(error) {
  // Default error structure
  const errorObj = {
    message: 'An unexpected error occurred',
    status: null,
    details: null,
    retry: false,
  };

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    errorObj.status = status;
    errorObj.details = data;

    switch (status) {
      case 400:
        errorObj.message = `Invalid request: ${data.detail || 'Please check your input'}`;
        break;
        
      case 401:
        errorObj.message = 'Authentication required. Please log in again.';
        break;
        
      case 403:
        errorObj.message = 'Access denied. You do not have permission to perform this action.';
        break;
        
      case 404:
        errorObj.message = 'Resource not found. It may have been deleted or moved.';
        break;
        
      case 429:
        const retryAfter = data.retry_after || 60;
        errorObj.message = `Rate limit exceeded. Please try again in ${retryAfter} seconds.`;
        errorObj.retry = true;
        errorObj.retryAfter = retryAfter;
        break;
        
      case 500:
        errorObj.message = 'Server error. Please try again later.';
        errorObj.retry = true;
        break;
        
      case 503:
        errorObj.message = 'Service temporarily unavailable. Please try again in a few moments.';
        errorObj.retry = true;
        break;
        
      default:
        errorObj.message = data.detail || data.message || `Error ${status}: ${error.message}`;
    }
  } else if (error.request) {
    // Request made but no response
    errorObj.message = 'Network error. Please check your internet connection.';
    errorObj.retry = true;
  } else {
    // Error in request setup
    errorObj.message = error.message || 'An unexpected error occurred';
  }

  return errorObj;
}

/**
 * Display error message to user
 * @param {Error} error - Error object
 * @param {Function} notificationFn - Optional notification function
 */
export function displayError(error, notificationFn = null) {
  const errorObj = handleAPIError(error);
  
  if (notificationFn) {
    notificationFn(errorObj.message, 'error');
  } else {
    console.error('[Error]:', errorObj.message, errorObj.details);
  }
  
  return errorObj;
}

/**
 * Check if error is retryable
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export function isRetryableError(error) {
  const errorObj = handleAPIError(error);
  return errorObj.retry;
}

/**
 * Extract retry delay from error
 * @param {Error} error - Error object
 * @returns {number} Delay in milliseconds
 */
export function getRetryDelay(error) {
  const errorObj = handleAPIError(error);
  return (errorObj.retryAfter || 5) * 1000;
}

/**
 * Format validation errors
 * @param {Object} validationErrors - Validation error object
 * @returns {string} Formatted error message
 */
export function formatValidationErrors(validationErrors) {
  if (!validationErrors || typeof validationErrors !== 'object') {
    return 'Validation failed';
  }

  const errors = Object.entries(validationErrors)
    .map(([field, messages]) => {
      const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const errorMessages = Array.isArray(messages) ? messages : [messages];
      return `${fieldName}: ${errorMessages.join(', ')}`;
    });

  return errors.join('\n');
}

/**
 * Error logger for debugging
 * @param {string} context - Context where error occurred
 * @param {Error} error - Error object
 * @param {Object} additionalInfo - Additional debug info
 */
export function logError(context, error, additionalInfo = {}) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`[Error] ${context}`);
    console.error('Error:', error);
    console.log('Additional Info:', additionalInfo);
    if (error.response) {
      console.log('Response Data:', error.response.data);
      console.log('Response Status:', error.response.status);
    }
    console.groupEnd();
  }
}
