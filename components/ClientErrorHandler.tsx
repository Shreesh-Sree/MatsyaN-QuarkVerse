"use client";

import { useEffect } from 'react';

export function ClientErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default browser behavior (logging to console)
      if (event.reason && typeof event.reason === 'string' && 
          event.reason.includes('google.maps')) {
        event.preventDefault();
      }
    };

    // Handle general JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('JavaScript error:', event.error);
      
      // Special handling for Google Maps errors
      if (event.message.includes('google.maps')) {
        console.warn('Google Maps related error detected - this may be due to API limitations or network issues');
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}

export default ClientErrorHandler;
