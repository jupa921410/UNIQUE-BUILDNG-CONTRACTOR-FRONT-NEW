import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { getConversionContext, readFormConversion, trackContentView, trackFormConversion } from '../src/config/conversions.js';

afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
});

function browser(cookie = '') {
  const calls = [];
  globalThis.window = {
    location: { origin: 'https://www.uniquebuildingcontractors.com', pathname: '/get-started', search: '?ref=private&oppref=click-ref' },
    oaiq: (...args) => calls.push(args),
  };
  globalThis.document = { cookie };
  return calls;
}

test('a declined request does not read cookies or enable measurement', () => {
  const calls = browser();
  Object.defineProperty(globalThis.document, 'cookie', { get() { throw new Error('must not read'); } });
  assert.deepEqual(getConversionContext(false), { consent: false });
  assert.deepEqual(calls, []);
  assert.equal(trackFormConversion(null), false);
});

test('consented requests forward opaque attribution references and exclude private URL parameters', () => {
  browser('__oppref=cookie%2Bclick; __obref=browser-reference');
  assert.deepEqual(getConversionContext(true), {
    consent: true,
    source_url: 'https://www.uniquebuildingcontractors.com/get-started',
    oppref: 'cookie+click',
    obref: 'browser-reference',
  });
});

test('cookie restrictions do not prevent submission', () => {
  browser();
  Object.defineProperty(globalThis.document, 'cookie', { get() { throw new Error('blocked'); } });
  assert.deepEqual(getConversionContext(true), { consent: true });
});

test('browser uses backend event ID and initializes only documented hashed user fields', () => {
  const calls = browser();
  const conversion = {
    event_id: 'lead_created:lead:123', pixel_id: 'pixel-test',
    user: { email_sha256: 'a'.repeat(64), external_id_sha256: 'b'.repeat(64), email: 'private@example.com', phone_number_sha256: 'c'.repeat(64) },
  };
  assert.equal(trackFormConversion(conversion), true);
  assert.deepEqual(calls, [
    ['init', { pixelId: 'pixel-test', user: { email_sha256: 'a'.repeat(64), external_id_sha256: 'b'.repeat(64) } }],
    ['measure', 'lead_created', { type: 'customer_action' }, { event_id: 'lead_created:lead:123' }],
  ]);
  assert.equal(JSON.stringify(calls).includes('private@example.com'), false);
});

test('tracking handles an unavailable SDK or missing response without throwing', () => {
  assert.equal(trackContentView(), false);
  assert.equal(trackFormConversion({ event_id: '123', pixel_id: 'test' }), false);
  browser();
  window.oaiq = () => { throw new Error('SDK failed'); };
  assert.equal(trackFormConversion({ event_id: '123', pixel_id: 'test' }), false);
});

test('an older backend or empty successful response does not fail a saved form', async () => {
  assert.equal(await readFormConversion({ json: async () => ({ success: true }) }), null);
  assert.equal(await readFormConversion({ json: async () => { throw new SyntaxError('empty'); } }), null);
  const conversion = { event_id: '123' };
  assert.equal(await readFormConversion({ json: async () => ({ conversion }) }), conversion);
});
