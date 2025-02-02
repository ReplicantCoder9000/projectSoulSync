class AppError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.trace = new Error().stack;
  }
}

// Error codes and their descriptions
const ErrorCodes = {
  // Authentication Errors (1xx)
  AUTH_001: 'No authentication token found',
  AUTH_002: 'Invalid token format',
  AUTH_003: 'Token expired',
  AUTH_004: 'Invalid credentials',

  // Network Errors (2xx)
  NET_001: 'Network request failed',
  NET_002: 'Request timeout',
  NET_003: 'Server unreachable',
  NET_004: 'API response format invalid',

  // Data Validation Errors (3xx)
  VAL_001: 'Required field missing',
  VAL_002: 'Invalid field format',
  VAL_003: 'Data constraint violation',
  VAL_004: 'Unique constraint violation',

  // State Management Errors (4xx)
  STATE_001: 'Invalid state transition',
  STATE_002: 'State update failed',
  STATE_003: 'Redux action failed',
  STATE_004: 'State synchronization error',

  // Component Errors (5xx)
  COMP_001: 'Component initialization failed',
  COMP_002: 'Component update failed',
  COMP_003: 'Component render error',
  COMP_004: 'Component lifecycle error'
};

const ErrorHandler = {
  handle: (error, context = {}) => {
    // Create detailed error object
    const errorDetails = {
      type: error.name,
      code: error.code || 'UNKNOWN',
      message: error.message,
      details: error.details || {},
      stack: error.stack,
      context: {
        ...context,
        location: window.location.href,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewportSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        devicePixelRatio: window.devicePixelRatio,
        onlineStatus: navigator.onLine
      }
    };

    // Log to console with appropriate method
    if (error instanceof AppError) {
      console.error(`🚨 Application Error [${error.code}]:`, errorDetails);
    } else if (error.name === 'NetworkError' || error.name === 'TypeError') {
      console.error('🌐 Network Error:', errorDetails);
    } else if (error.name === 'SyntaxError') {
      console.error('🔧 Syntax Error:', errorDetails);
    } else {
      console.error('❌ Unhandled Error:', errorDetails);
    }

    // Handle specific error types
    if (error instanceof AppError) {
      return ErrorHandler.handleAppError(error, errorDetails);
    } else if (error.name === 'NetworkError' || error.message.includes('network')) {
      return ErrorHandler.handleNetworkError(error, errorDetails);
    } else if (error.name === 'TypeError' || error.name === 'SyntaxError') {
      return ErrorHandler.handleSystemError(error, errorDetails);
    }

    return errorDetails;
  },

  handleAppError: (error, details) => {
    const appErrorDetails = {
      ...details,
      errorCode: error.code,
      errorType: 'Application',
      recoverable: true,
      suggestedAction: ErrorHandler.getSuggestedAction(error.code)
    };

    // Log with application context
    console.error(`🚨 Application Error [${error.code}]:`, appErrorDetails);

    return appErrorDetails;
  },

  handleNetworkError: (error, details) => {
    const networkInfo = {
      online: navigator.onLine,
      type: navigator.connection ? navigator.connection.effectiveType : 'unknown',
      rtt: navigator.connection ? navigator.connection.rtt : 'unknown',
      downlink: navigator.connection ? navigator.connection.downlink : 'unknown',
      saveData: navigator.connection ? navigator.connection.saveData : 'unknown'
    };

    const networkErrorDetails = {
      ...details,
      errorType: 'Network',
      networkInfo,
      recoverable: true,
      retryable: true,
      suggestedAction: 'Check network connection and retry'
    };

    // Log with network context
    console.error('🌐 Network Error:', networkErrorDetails);

    return networkErrorDetails;
  },

  handleSystemError: (error, details) => {
    const systemErrorDetails = {
      ...details,
      errorType: 'System',
      recoverable: false,
      browserInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack
      }
    };

    // Log with system context
    console.error('🔧 System Error:', systemErrorDetails);

    return systemErrorDetails;
  },

  getSuggestedAction: (errorCode) => {
    const actionMap = {
      AUTH_001: 'Please log in again',
      AUTH_002: 'Clear browser data and log in again',
      AUTH_003: 'Session expired. Please log in again',
      AUTH_004: 'Check credentials and try again',
      NET_001: 'Check network connection and retry',
      NET_002: 'Server is taking too long to respond. Try again later',
      NET_003: 'Unable to reach server. Check network connection',
      NET_004: 'Invalid data received. Please refresh the page',
      VAL_001: 'Please fill in all required fields',
      VAL_002: 'Check input format and try again',
      VAL_003: 'Input violates constraints. Please review',
      VAL_004: 'This value already exists. Try another',
      STATE_001: 'Invalid app state. Please refresh',
      STATE_002: 'Unable to update. Please refresh',
      STATE_003: 'Action failed. Try again',
      STATE_004: 'State sync error. Please refresh',
      COMP_001: 'Component error. Please refresh',
      COMP_002: 'Update failed. Please refresh',
      COMP_003: 'Display error. Please refresh',
      COMP_004: 'Component error. Please refresh'
    };

    return actionMap[errorCode] || 'Please try again or contact support';
  },

  isRecoverable: (error) => {
    const unrecoverableErrors = [
      'SyntaxError',
      'ReferenceError',
      'TypeError'
    ];
    return !unrecoverableErrors.includes(error.name);
  },

  getErrorSeverity: (error) => {
    if (error instanceof AppError) {
      return error.code.startsWith('AUTH') ? 'high' : 'medium';
    }
    return error.name === 'NetworkError' ? 'medium' : 'high';
  }
};

export { AppError, ErrorCodes, ErrorHandler };
