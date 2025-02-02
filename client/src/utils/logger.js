const Logger = {
  startGroup: (name, data = {}) => {
    console.group(`🔍 ${name} - ${new Date().toISOString()}`);
    console.log('Context:', {
      ...data,
      timestamp: performance.now(),
      memory: window.performance.memory ? {
        usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1048576) + 'MB',
        totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / 1048576) + 'MB'
      } : 'Not available'
    });
  },

  endGroup: () => console.groupEnd(),

  state: (label, state) => {
    console.log(`📊 ${label}:`, {
      ...state,
      _meta: {
        timestamp: new Date().toISOString(),
        trace: new Error().stack
      }
    });
  },

  error: (label, error, context = {}) => {
    console.error(`❌ ${label}:`, {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        memory: window.performance.memory ? {
          usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1048576) + 'MB'
        } : 'Not available'
      }
    });
  },

  network: (type, details) => {
    const icon = type === 'request' ? '📤' : '📥';
    console.log(`${icon} Network ${type}:`, {
      ...details,
      _meta: {
        timestamp: new Date().toISOString(),
        performance: {
          timing: window.performance.timing,
          navigation: window.performance.navigation
        }
      }
    });
  },

  component: (name, props, state) => {
    console.log(`🔷 Component ${name}:`, {
      props,
      state,
      _meta: {
        renderCount: window.__RENDER_COUNT?.[name] || 0,
        timestamp: new Date().toISOString()
      }
    });
  },

  redux: (action, prevState, nextState) => {
    console.log(`⚛️ Redux Action ${action.type}:`, {
      action,
      prevState,
      nextState,
      diff: Object.keys(nextState).reduce((acc, key) => {
        if (prevState[key] !== nextState[key]) {
          acc[key] = {
            from: prevState[key],
            to: nextState[key]
          };
        }
        return acc;
      }, {}),
      _meta: {
        timestamp: new Date().toISOString(),
        trace: new Error().stack
      }
    });
  },

  performance: (label, startTime) => {
    const duration = performance.now() - startTime;
    console.log(`⚡ Performance ${label}:`, {
      duration: `${duration.toFixed(2)}ms`,
      _meta: {
        timestamp: new Date().toISOString(),
        memory: window.performance.memory ? {
          usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1048576) + 'MB'
        } : 'Not available'
      }
    });
  }
};

export default Logger;
