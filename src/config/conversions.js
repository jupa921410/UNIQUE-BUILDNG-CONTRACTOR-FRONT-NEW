export function trackFormConversion() {
  // Tracking must never interrupt a successful form submission.
  try {
    if (typeof window.oaiq === 'function') {
      window.oaiq('measure', 'lead_created', { type: 'customer_action' });
    }
  } catch (error) {
    console.warn('Form conversion tracking failed:', error);
  }
}
