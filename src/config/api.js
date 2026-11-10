// ============================================================
//  API Configuration
//  Centraliza todas las URLs de la API del proyecto.
//  Para cambiar el endpoint del formulario de contacto,
//  solo modifica CONTACT_FORM_URL en este archivo.
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://admin.uniquebuildingcontractors.com';

export const API_ENDPOINTS = {
  /**
   * Endpoint que recibe los datos del formulario de contacto.
   * Método esperado: POST
   * Body: { name, email, phone, service, message }
   */
  CONTACT_FORM: `${API_BASE_URL}/api/contact`,

  /**
   * Formulario de calificación de clientes (página /get-started).
   * POST /api/qualify                 → guarda respuestas en "Leads Filtrados"
   * GET  /api/qualify/prefill/{token} → datos de contacto para links personalizados (?ref=TOKEN)
   */
  QUALIFY_FORM: `${API_BASE_URL}/api/qualify`,
  QUALIFY_PREFILL: (token) => `${API_BASE_URL}/api/qualify/prefill/${encodeURIComponent(token)}`,

  /**
   * Portfolio / Showcase projects.
   * GET /api/showcase         → lista de proyectos publicados
   * GET /api/showcase/slug/{slug}   → detalle completo de un proyecto
   */
  SHOWCASE_LIST: `${API_BASE_URL}/api/showcase`,
  SHOWCASE_DETAIL: (slug) => `${API_BASE_URL}/api/showcase/slug/${slug}`,
};

/**
 * Client Portal — Sanctum bearer-token JSON API.
 * See UNIQUE-BUILDING-CONTRACTORS-BACKEND routes/api.php (prefix /api/client).
 */
export const CLIENT_API_BASE = `${API_BASE_URL}/api/client`;

export { API_BASE_URL };

export default API_ENDPOINTS;
