// ============================================================
//  Showcase / Portfolio Service
//  Centralizes all calls to the /api/showcase backend endpoint.
// ============================================================

import { API_ENDPOINTS } from '../config/api';

/**
 * Fetches the list of all published showcase projects.
 * Endpoint: GET /api/showcase
 * @returns {Promise<Array>} Array of project objects
 */
async function requestJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
  } catch (error) {
    throw new Error(error.name === 'AbortError' ? 'The project server timed out. Please try again.' : 'The project server is temporarily unavailable. Please try again.', { cause: error });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) {
    throw new Error(`Failed to load projects (${response.status})`);
  }
  return response.json();
}

export async function fetchShowcaseProjects() {
  const json = await requestJson(API_ENDPOINTS.SHOWCASE_LIST);
  // API wraps data in a { data: [...] } envelope
  const projects = Array.isArray(json) ? json : json.data;
  return Array.isArray(projects) ? projects : [];
}

/**
 * Fetches a single published showcase project by its slug.
 * Endpoint: GET /api/showcase/slug/{slug}
 * Returns 404 if the project is not published.
 * @param {string} slug
 * @returns {Promise<Object>} Full project object
 */
export async function fetchShowcaseProject(slug) {
  const json = await requestJson(API_ENDPOINTS.SHOWCASE_DETAIL(encodeURIComponent(slug)));
  return json.data ?? json;
}

/**
 * Utility – picks the primary image URL from a project, or the first
 * available one, or returns null when there are no images.
 * @param {Object} project
 * @returns {string|null}
 */
export function getPrimaryImage(project) {
  if (!project?.images?.length) return null;
  const validMedia = project.images.filter((img) => ['image', 'image_360'].includes(img.media_type) && img.url);
  if (!validMedia.length) return null;
  const primary = validMedia.find((img) => img.is_primary);
  return (primary ?? validMedia[0]).url;
}

/**
 * Formats a completion_date string (ISO) into a human-readable month + year.
 * e.g. "2024-11-15" → "November 2024"
 * @param {string} dateStr
 * @returns {string}
 */
export function formatCompletionDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
