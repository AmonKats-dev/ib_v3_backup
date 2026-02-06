// Process polyfill for browser environment
/* eslint-disable no-undef, no-restricted-globals */
(function() {
  const processEnv = {
    NODE_ENV: 'development',
    REACT_APP_API_URL: 'http://localhost:5000/api/v1',
    REACT_ADMIN_API_URL: 'http://localhost:5000/api/admin',
    REACT_APP_STATIC_URL: 'http://localhost:3000',
    REACT_APP_APP_CONFIG: 'ug',
    PUBLIC_URL: ''
  };

  const processObj = { env: processEnv };

  // Set process on all possible global objects
  if (typeof global !== 'undefined') global.process = processObj;
  if (typeof window !== 'undefined') window.process = processObj;
  // eslint-disable-next-line no-undef
  if (typeof globalThis !== 'undefined') globalThis.process = processObj;
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined') self.process = processObj;

  // Also set it on the global scope
  if (typeof globalThis !== 'undefined') {
    globalThis.process = processObj;
  }

  // Define as non-configurable property on window
  if (typeof window !== 'undefined') {
    try {
      Object.defineProperty(window, 'process', {
        value: processObj,
        writable: true,
        configurable: false,
        enumerable: true
      });
    } catch (e) {
      // Ignore if already defined
    }
  }

  // Make sure process is available globally
  if (typeof globalThis !== 'undefined') {
    try {
      Object.defineProperty(globalThis, 'process', {
        value: processObj,
        writable: true,
        configurable: false,
        enumerable: true
      });
    } catch (e) {
      // Ignore if already defined
    }
  }

  // Ensure process is available immediately
  if (typeof window !== 'undefined' && !window.process) {
    window.process = processObj;
  }
})();

// Global error handler for process errors
window.addEventListener('error', function(event) {
  if (event.message && event.message.includes('process is not defined')) {
    console.warn('Process error caught in React app:', event.message);
    event.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && event.reason.message && event.reason.message.includes('process is not defined')) {
    console.warn('Process promise rejection caught in React app:', event.reason.message);
    event.preventDefault();
    return false;
  }
});
