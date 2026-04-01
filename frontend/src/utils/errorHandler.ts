export const handleError = (error: unknown, context?: string): string => {
  console.error(`[Dev Log] Error in ${context || 'Unknown Context'}:`, error);

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) {
      return "Unable to connect to the server at this time. Please try again later.";
    }
    
    if (msg.includes('auth') || msg.includes('token') || msg.includes('401') || msg.includes('403')) {
      return "Your session has expired or you lack permissions for this action.";
    }

    if (msg.includes('500') || msg.includes('internal')) {
      return "An unexpected system error occurred. Our team has been notified.";
    }

    return "We encountered an issue processing your request.";
  }

  return "An unknown error has occurred.";
};
