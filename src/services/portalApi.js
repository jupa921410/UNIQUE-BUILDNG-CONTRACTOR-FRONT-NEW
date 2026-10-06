// ============================================================
//  Client Portal Service
//  Centralizes all calls to the /api/client backend endpoints
//  (Sanctum bearer-token auth). Mirrors the request/timeout/error
//  pattern already used in src/services/showcaseService.js.
// ============================================================

import { CLIENT_API_BASE } from '../config/api';

const TOKEN_KEY = 'ubc_portal_token';

function safeStorage() {
  try {
    // Touch localStorage to trigger any SecurityError early (private mode, blocked storage, etc.)
    const testKey = '__ubc_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getToken() {
  const storage = safeStorage();
  try {
    return storage ? storage.getItem(TOKEN_KEY) : null;
  } catch {
    return null;
  }
}

export function setToken(token) {
  const storage = safeStorage();
  if (!storage) return;
  try {
    if (token) storage.setItem(TOKEN_KEY, token);
    else storage.removeItem(TOKEN_KEY);
  } catch {
    // ignore — private browsing / storage blocked
  }
}

let unauthorizedHandler = null;
/** Registered once by PortalAuthContext so a 401 anywhere logs the user out. */
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

class PortalApiError extends Error {
  constructor(message, { status, errors } = {}) {
    super(message);
    this.name = 'PortalApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, { method = 'GET', body, isForm = false, timeoutMs = 20000 } = {}) {
  const token = getToken();
  const headers = { Accept: 'application/json' };
  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${CLIENT_API_BASE}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    throw new PortalApiError(
      error.name === 'AbortError'
        ? 'The server took too long to respond. Please try again.'
        : 'Could not reach the server. Please check your connection and try again.',
      { status: 0 }
    );
  } finally {
    clearTimeout(timeout);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // No JSON body (e.g. an empty 204 or a non-JSON error page) — leave data null.
  }

  if (response.status === 401) {
    setToken(null);
    unauthorizedHandler?.();
    throw new PortalApiError('Your session has expired. Please log in again.', { status: 401 });
  }

  if (!response.ok) {
    const firstFieldError = data?.errors ? Object.values(data.errors)[0]?.[0] : null;
    const message = firstFieldError || data?.message || `Request failed (${response.status})`;
    throw new PortalApiError(message, { status: response.status, errors: data?.errors });
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────────────

export async function login(email, password) {
  return request('/login', { method: 'POST', body: { email, password, device_name: 'client-portal-web' } });
}

export async function forgotPassword(email) {
  return request('/forgot-password', { method: 'POST', body: { email } });
}

export async function resetPassword({ token, email, password, password_confirmation }) {
  return request('/reset-password', {
    method: 'POST',
    body: { token, email, password, password_confirmation, device_name: 'client-portal-web' },
  });
}

export async function logout() {
  try {
    await request('/logout', { method: 'POST' });
  } finally {
    setToken(null);
  }
}

export async function fetchMe() {
  return request('/me');
}

export async function updateProfile(payload) {
  return request('/profile', { method: 'PUT', body: payload });
}

// ── Projects ─────────────────────────────────────────────────

export async function fetchProjects() {
  return request('/projects');
}

export async function fetchProject(projectId) {
  return request(`/projects/${projectId}`);
}

// ── Files (feature 1) ────────────────────────────────────────

export async function uploadDocuments(projectId, files, title) {
  const form = new FormData();
  if (title) form.append('title', title);
  files.forEach((file) => form.append('files[]', file));
  return request(`/projects/${projectId}/documents`, { method: 'POST', body: form, isForm: true, timeoutMs: 60000 });
}

export async function deleteDocument(documentId) {
  return request(`/documents/${documentId}`, { method: 'DELETE' });
}

/** Download a protected project file using the current Bearer token. */
export async function downloadDocument(document) {
  const token = getToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  let response;

  try {
    response = await fetch(document.download_url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      signal: controller.signal,
    });
  } catch (error) {
    throw new PortalApiError(
      error.name === 'AbortError'
        ? 'The download took too long. Please try again.'
        : 'Could not download this file. Please check your connection and try again.',
      { status: 0 }
    );
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 401) {
    setToken(null);
    unauthorizedHandler?.();
    throw new PortalApiError('Your session has expired. Please log in again.', { status: 401 });
  }
  if (!response.ok) throw new PortalApiError(`Could not download this file (${response.status}).`, { status: response.status });

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = window.document.createElement('a');
  link.href = url;
  link.download = document.original_name || document.title || 'download';
  link.style.display = 'none';
  window.document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Invoices ─────────────────────────────────────────────────

export async function fetchInvoices(projectId) {
  return request(projectId ? `/projects/${projectId}/invoices` : '/invoices');
}

// ── Contract / e-signature (feature 2) ──────────────────────

export async function fetchContract(projectId) {
  return request(`/projects/${projectId}/contract`);
}

export async function signContract(projectId, payload) {
  return request(`/projects/${projectId}/contract/sign`, { method: 'POST', body: payload });
}

// ── Walkthrough sign-off (feature 3) ────────────────────────

export async function fetchWalkthrough(projectId) {
  return request(`/projects/${projectId}/walkthrough`);
}

export async function updateWalkthroughItem(itemId, payload) {
  return request(`/walkthrough-items/${itemId}`, { method: 'PATCH', body: payload });
}

export async function signWalkthrough(projectId, payload) {
  return request(`/projects/${projectId}/walkthrough/sign`, { method: 'POST', body: payload });
}

// ── Chat (feature 5) ─────────────────────────────────────────

export async function fetchMessages(projectId, afterId) {
  const query = afterId ? `?after_id=${afterId}` : '';
  return request(`/projects/${projectId}/messages${query}`);
}

export async function sendMessage(projectId, { body, attachment }) {
  if (attachment instanceof File) {
    const form = new FormData();
    if (body) form.append('body', body);
    form.append('attachment', attachment);
    return request(`/projects/${projectId}/messages`, { method: 'POST', body: form, isForm: true, timeoutMs: 60000 });
  }
  return request(`/projects/${projectId}/messages`, { method: 'POST', body: { body } });
}

export async function markMessagesRead(projectId, lastMessageId) {
  return request(`/projects/${projectId}/messages/read`, { method: 'POST', body: { last_message_id: lastMessageId } });
}

export { PortalApiError };
export const fetchMaterialSelections = (projectId) => request(`/projects/${projectId}/material-selections`);
export const fetchMaterialSelection = (projectId, id) => request(`/projects/${projectId}/material-selections/${id}`);
export const saveMaterialSelection = (projectId, id, payload) => request(`/projects/${projectId}/material-selections/${id}`, { method: 'PUT', body: payload });
export const signMaterialSelection = (projectId, id, payload) => request(`/projects/${projectId}/material-selections/${id}/sign`, { method: 'POST', body: payload });
