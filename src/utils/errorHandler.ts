// errorHandler.ts - Utility for handling blockchain and API errors

export interface ParsedError {
  title: string;
  description: string;
  status: 'error' | 'warning' | 'info';
}

/**
 * Parse blockchain/transaction errors and return user-friendly messages
 */
export const parseBlockchainError = (error: any): ParsedError => {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  // User rejected transaction
  if (
    errorMessage.includes('user rejected') || 
    errorMessage.includes('user denied') ||
    errorMessage.includes('rejected the request') ||
    errorString.includes('user rejected') ||
    errorMessage.includes('action_rejected')
  ) {
    return {
      title: 'Transaction Cancelled',
      description: 'You cancelled the transaction.',
      status: 'warning'
    };
  }

  // Insufficient funds
  if (
    errorMessage.includes('insufficient funds') || 
    errorMessage.includes('insufficient balance') ||
    errorMessage.includes('exceeds balance')
  ) {
    return {
      title: 'Insufficient Balance',
      description: 'You don\'t have enough ETH to complete this transaction.',
      status: 'error'
    };
  }

  // Gas estimation failed
  if (
    errorMessage.includes('gas required exceeds') ||
    errorMessage.includes('cannot estimate gas') ||
    errorMessage.includes('gas estimation')
  ) {
    return {
      title: 'Transaction Failed',
      description: 'Unable to process transaction. The operation might not be allowed.',
      status: 'error'
    };
  }

  // Network issues
  if (
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('disconnected')
  ) {
    return {
      title: 'Network Error',
      description: 'Please check your internet connection and try again.',
      status: 'error'
    };
  }

  // Wrong network
  if (
    errorMessage.includes('wrong network') ||
    errorMessage.includes('chain mismatch') ||
    errorMessage.includes('unsupported chain')
  ) {
    return {
      title: 'Wrong Network',
      description: 'Please switch to the correct network in your wallet.',
      status: 'warning'
    };
  }

  // Contract errors
  if (
    errorMessage.includes('execution reverted') ||
    errorMessage.includes('revert')
  ) {
    // Try to extract a meaningful reason
    const revertMatch = errorMessage.match(/reason:\s*"?([^"]+)"?/i);
    if (revertMatch) {
      return {
        title: 'Transaction Failed',
        description: revertMatch[1],
        status: 'error'
      };
    }
    return {
      title: 'Transaction Failed',
      description: 'The transaction could not be completed. Please try again.',
      status: 'error'
    };
  }

  // Quest specific errors
  if (errorMessage.includes('quest requirements not met')) {
    return {
      title: 'Quest Incomplete',
      description: 'You haven\'t met all the requirements for this quest yet.',
      status: 'warning'
    };
  }

  if (errorMessage.includes('quest is not active')) {
    return {
      title: 'Quest Unavailable',
      description: 'This quest is not currently active.',
      status: 'warning'
    };
  }

  if (errorMessage.includes('quest already completed')) {
    return {
      title: 'Already Completed',
      description: 'You have already completed this quest.',
      status: 'info'
    };
  }

  // Minting specific errors
  if (errorMessage.includes('already minted') || errorMessage.includes('already exists')) {
    return {
      title: 'Already Minted',
      description: 'This element has already been minted.',
      status: 'info'
    };
  }

  // Wallet not connected
  if (
    errorMessage.includes('wallet not connected') ||
    errorMessage.includes('no provider') ||
    errorMessage.includes('not connected')
  ) {
    return {
      title: 'Wallet Not Connected',
      description: 'Please connect your wallet to continue.',
      status: 'warning'
    };
  }

  // Nonce errors
  if (errorMessage.includes('nonce')) {
    return {
      title: 'Transaction Error',
      description: 'Please wait for your pending transactions to complete and try again.',
      status: 'warning'
    };
  }

  // Rate limiting
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return {
      title: 'Too Many Requests',
      description: 'Please wait a moment before trying again.',
      status: 'warning'
    };
  }

  // Default error
  return {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
    status: 'error'
  };
};

/**
 * Truncate transaction hash or address for display
 */
export const truncateHash = (hash: string, startLength: number = 6, endLength: number = 4): string => {
  if (!hash || hash.length < startLength + endLength) return hash;
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
};

/**
 * Format error for logging (keeps full details for debugging)
 */
export const formatErrorForLog = (error: any): string => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
};
