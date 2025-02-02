import Logger from './logger';

const PerformanceMonitor = {
  marks: new Map(),
  measures: new Map(),

  start: (label, context = {}) => {
    const startTime = performance.now();
    PerformanceMonitor.marks.set(label, {
      startTime,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        memory: window.performance.memory ? {
          usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1048576) + 'MB',
          totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / 1048576) + 'MB'
        } : 'Not available'
      }
    });

    // Create performance mark
    performance.mark(`${label}-start`);

    Logger.performance(`${label} started`, {
      startTime,
      context
    });
  },

  end: (label) => {
    const endTime = performance.now();
    const markData = PerformanceMonitor.marks.get(label);

    if (!markData) {
      Logger.error('Performance Measurement Error', new Error(`No start mark found for "${label}"`));
      return null;
    }

    const { startTime, context } = markData;
    const duration = endTime - startTime;

    // Create performance measure
    performance.mark(`${label}-end`);
    try {
      performance.measure(label, `${label}-start`, `${label}-end`);
    } catch (error) {
      Logger.error('Performance Measure Error', error);
    }

    // Store measure data
    PerformanceMonitor.measures.set(label, {
      duration,
      startTime,
      endTime,
      context
    });

    // Clear marks
    PerformanceMonitor.marks.delete(label);
    try {
      performance.clearMarks(`${label}-start`);
      performance.clearMarks(`${label}-end`);
    } catch (error) {
      Logger.error('Performance Clear Marks Error', error);
    }

    Logger.performance(`${label} completed`, {
      duration: `${duration.toFixed(2)}ms`,
      context
    });

    return duration;
  },

  getMetrics: () => {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    const paintTiming = performance.getEntriesByType('paint');
    const resourceTiming = performance.getEntriesByType('resource');

    const metrics = {
      navigation: navigationTiming ? {
        // DNS lookup time
        dns: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
        
        // TCP connection time
        tcp: navigationTiming.connectEnd - navigationTiming.connectStart,
        
        // Time to First Byte (TTFB)
        ttfb: navigationTiming.responseStart - navigationTiming.requestStart,
        
        // Server response time
        serverResponse: navigationTiming.responseEnd - navigationTiming.responseStart,
        
        // DOM Content Loaded
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
        
        // Load event
        loadEvent: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
        
        // Total page load time
        totalPageLoad: navigationTiming.loadEventEnd - navigationTiming.startTime,
        
        // DOM interactive time
        domInteractive: navigationTiming.domInteractive - navigationTiming.startTime,
        
        // Document fetch time
        fetch: navigationTiming.responseEnd - navigationTiming.fetchStart
      } : 'Navigation timing not available',

      paint: {
        firstPaint: paintTiming.find(entry => entry.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintTiming.find(entry => entry.name === 'first-contentful-paint')?.startTime
      },

      resources: resourceTiming.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        transferSize: entry.transferSize,
        initiatorType: entry.initiatorType
      })),

      memory: window.performance.memory ? {
        usedJSHeapSize: Math.round(window.performance.memory.usedJSHeapSize / 1048576) + 'MB',
        totalJSHeapSize: Math.round(window.performance.memory.totalJSHeapSize / 1048576) + 'MB',
        jsHeapSizeLimit: Math.round(window.performance.memory.jsHeapSizeLimit / 1048576) + 'MB'
      } : 'Memory metrics not available',

      customMeasures: Array.from(PerformanceMonitor.measures.entries()).map(([label, data]) => ({
        label,
        duration: data.duration,
        startTime: data.startTime,
        endTime: data.endTime,
        context: data.context
      }))
    };

    // Log complete metrics
    Logger.state('Performance Metrics', metrics);

    return metrics;
  },

  clearMetrics: () => {
    try {
      performance.clearMarks();
      performance.clearMeasures();
      PerformanceMonitor.marks.clear();
      PerformanceMonitor.measures.clear();
      Logger.state('Performance metrics cleared', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      Logger.error('Clear Performance Metrics Error', error);
    }
  },

  measureAsync: async (label, asyncFn, context = {}) => {
    PerformanceMonitor.start(label, context);
    try {
      const result = await asyncFn();
      PerformanceMonitor.end(label);
      return result;
    } catch (error) {
      PerformanceMonitor.end(label);
      throw error;
    }
  },

  isSlowOperation: (duration, threshold = 100) => {
    return duration > threshold;
  },

  getResourceMetrics: () => {
    const resources = performance.getEntriesByType('resource');
    return resources.map(resource => ({
      name: resource.name,
      type: resource.initiatorType,
      duration: resource.duration,
      size: resource.transferSize,
      startTime: resource.startTime,
      fetchStart: resource.fetchStart,
      responseEnd: resource.responseEnd
    }));
  }
};

export default PerformanceMonitor;
