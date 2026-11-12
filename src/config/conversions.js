function measureEvent(eventName, type) {
  // Tracking must never interrupt navigation or a successful form submission.
  try {
    if (typeof window === 'undefined' || typeof window.oaiq !== 'function') {
      return false;
    }
    // The bootstrap in index.html queues calls until the SDK has loaded.
    window.oaiq('measure', eventName, { type });
    return true;
  } catch (error) {
    console.warn('Conversion tracking failed:', error);
    return false;
  }
}

export function trackContentView() {
  return measureEvent('contents_viewed', 'contents');
}

export function trackFormConversion() {
  return measureEvent('lead_created', 'customer_action');
}
