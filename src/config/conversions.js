function measureEvent(eventName, type, options) {
  // Tracking must never interrupt navigation or a successful form submission.
  try {
    if (typeof window === 'undefined' || typeof window.oaiq !== 'function') {
      return false;
    }
    // The bootstrap in index.html queues calls until the SDK has loaded.
    window.oaiq('measure', eventName, { type }, options);
    return true;
  } catch (error) {
    console.warn('Conversion tracking failed:', error);
    return false;
  }
}

export function trackContentView() {
  return measureEvent('contents_viewed', 'contents');
}

function readCookie(name) {
  const prefix = `${name}=`;
  const value = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(prefix));
  return value ? decodeURIComponent(value.slice(prefix.length)) : undefined;
}

export function getConversionContext(consent) {
  if (!consent || typeof window === 'undefined') return { consent: false };

  try {
    // This opt-in applies to measuring the submitted request, independently of SMS.
    window.oaiq?.('consent', true);
    return {
      consent: true,
      source_url: window.location.origin + window.location.pathname,
      oppref: readCookie('__oppref') || new URLSearchParams(window.location.search).get('oppref') || undefined,
      obref: readCookie('__obref'),
    };
  } catch {
    // Cookie restrictions must not prevent saving the request.
    return { consent: true };
  }
}

export function trackFormConversion(conversion) {
  try {
    if (!conversion?.event_id || !conversion.pixel_id || typeof window === 'undefined' || typeof window.oaiq !== 'function') return false;

    // The backend returns only hashed identifiers, never a raw email or CRM ID.
    const user = Object.fromEntries(
      ['email_sha256', 'external_id_sha256']
        .filter(key => /^[a-f0-9]{64}$/.test(conversion.user?.[key]))
        .map(key => [key, conversion.user[key]]),
    );
    window.oaiq('init', { pixelId: conversion.pixel_id, user });
    return measureEvent('lead_created', 'customer_action', { event_id: conversion.event_id });
  } catch {
    return false;
  }
}

export async function readFormConversion(response) {
  try {
    const payload = await response.json();
    return payload?.conversion ?? null;
  } catch {
    // Support older backends and successful responses with no JSON body.
    return null;
  }
}
