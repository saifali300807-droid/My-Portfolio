// src/services/api.js
/* ---------------------------------------------------------------------------
 * Sky Code — API Service Layer
 * ---------------------------------------------------------------------------
 * Centralised Axios client for the Sky Code backend.
 *
 * API URL priority:
 *   1. `VITE_API_URL` build-time env var — live/production build ke liye
 *      (jaise Render ka `https://my-backend.onrender.com/api`)
 *   2. `http://localhost:5000/api` — local development default
 *
 * Every exported function resolves instead of rejecting: network errors,
 * server errors and invalid tokens degrade to graceful fallbacks (empty
 * arrays or a structured `{ success: false }` envelope), so the UI never
 * needs to wrap a single call in try/catch.
 * ------------------------------------------------------------------------- */

import axios from 'axios'

/** Shared Axios instance pointed at the Sky Code REST API. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

/* -------------------------- internal helpers ----------------------------- */

/** Bearer authorisation headers for protected endpoints. */
const withAuth = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

/** Normalises a resolved HTTP response down to its JSON payload. */
const unwrap = (response) =>
  response && response.data ? response.data : { success: false }

/** Pulls a readable message out of any thrown error shape. */
const messageOf = (error) =>
  error?.response?.data?.message || error?.message || 'Unexpected network error'

/* --------------------------- public methods ------------------------------ */

/**
 * Fetches all projects from the backend.
 *
 * @param {string} [category] - Optional category name used as `?category=` filter.
 * @returns {Promise<Array<Object>>} Project list — always an array.
 */
export async function getProjects(category) {
  try {
    const response = await api.get('/projects', {
      params: category ? { category } : undefined,
    })
    const list = unwrap(response).data
    return Array.isArray(list) ? list : []
  } catch (error) {
    console.warn('[SkyCode API]', 'getProjects failed:', messageOf(error))
    return []
  }
}

/**
 * Authenticates an administrator against `POST /api/admin/login`.
 *
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<{ success: boolean, token: string|null, admin: object|null }>}
 */
export async function loginAdmin(credentials) {
  try {
    const body = unwrap(await api.post('/admin/login', credentials))
    return {
      success: Boolean(body.success),
      token: body.token || null,
      admin: body.admin || null,
    }
  } catch (error) {
    console.warn('[SkyCode API]', 'loginAdmin failed:', messageOf(error))
    return { success: false, token: null, admin: null }
  }
}

/**
 * Verifies an admin token against `GET /api/admin/me`.
 * Used to detect expired/invalid stored sessions on app load.
 *
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<{ success: boolean, admin: object|null }>}
 */
export async function getAdminMe(token) {
  try {
    const body = unwrap(await api.get('/admin/me', withAuth(token)))
    return { success: Boolean(body.success), admin: body.admin || null }
  } catch (error) {
    console.warn('[SkyCode API]', 'getAdminMe failed:', messageOf(error))
    return { success: false, admin: null }
  }
}

/**
 * Creates a new project as an authenticated admin.
 *
 * @param {object} data  - Project payload (title, category, description, …).
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<{ success: boolean, data: object|null, message?: string }>}
 */
export async function addProject(data, token) {
  try {
    if (!data || typeof data !== 'object') {
      return { success: false, data: null, message: 'Missing project payload' }
    }
    const body = unwrap(await api.post('/projects', data, withAuth(token)))
    return { success: Boolean(body.success), data: body.data || null, message: body.message }
  } catch (error) {
    console.warn('[SkyCode API]', 'addProject failed:', messageOf(error))
    return { success: false, data: null, message: messageOf(error) }
  }
}

/**
 * Updates an existing project (admin edit: title, category, description,
 * liveUrl, imageUrl, tags — sab kuch).
 *
 * @param {string} id    - Project id to update.
 * @param {object} data  - Updated project payload.
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<{ success: boolean, data: object|null, message?: string }>}
 */
export async function editProject(id, data, token) {
  try {
    if (!id || !data || typeof data !== 'object') {
      return { success: false, data: null, message: 'Missing project id or payload' }
    }
    const body = unwrap(
      await api.put(`/projects/${encodeURIComponent(id)}`, data, withAuth(token)),
    )
    return { success: Boolean(body.success), data: body.data || null, message: body.message }
  } catch (error) {
    console.warn('[SkyCode API]', 'editProject failed:', messageOf(error))
    return { success: false, data: null, message: messageOf(error) }
  }
}

/**
 * Deletes a project by its id.
 *
 * @param {string} id    - Project id to remove.
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<{ success: boolean, id?: string, message?: string }>}
 */
export async function removeProject(id, token) {
  try {
    if (!id) {
      return { success: false, message: 'Missing project id' }
    }
    const body = unwrap(
      await api.delete(`/projects/${encodeURIComponent(id)}`, withAuth(token)),
    )
    return { success: Boolean(body.success), id, message: body.message }
  } catch (error) {
    console.warn('[SkyCode API]', 'removeProject failed:', messageOf(error))
    return { success: false, id, message: messageOf(error) }
  }
}

/**
 * Submits a plan request (visitor form: name, whatsapp, email, plan, work type).
 *
 * @param {object} data - { name, whatsapp, email, plan, workType, details }
 * @returns {Promise<{ success: boolean, data: object|null, message?: string }>}
 */
export async function submitLead(data) {
  try {
    if (!data || typeof data !== 'object') {
      return { success: false, data: null, message: 'Missing request payload' }
    }
    const body = unwrap(await api.post('/leads', data))
    return { success: Boolean(body.success), data: body.data || null, message: body.message }
  } catch (error) {
    console.warn('[SkyCode API]', 'submitLead failed:', messageOf(error))
    return { success: false, data: null, message: messageOf(error) }
  }
}

/**
 * Fetches all plan submissions (admin only).
 *
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<Array<Object>>} Lead list — always an array.
 */
export async function getLeads(token) {
  try {
    const response = await api.get('/leads', withAuth(token))
    const list = unwrap(response).data
    return Array.isArray(list) ? list : []
  } catch (error) {
    console.warn('[SkyCode API]', 'getLeads failed:', messageOf(error))
    return []
  }
}

/**
 * Deletes a lead submission by its id (admin only).
 *
 * @param {string} id    - Lead id to remove.
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<{ success: boolean, id?: string, message?: string }>}
 */
export async function removeLead(id, token) {
  try {
    if (!id) {
      return { success: false, message: 'Missing lead id' }
    }
    const body = unwrap(
      await api.delete(`/leads/${encodeURIComponent(id)}`, withAuth(token)),
    )
    return { success: Boolean(body.success), id, message: body.message }
  } catch (error) {
    console.warn('[SkyCode API]', 'removeLead failed:', messageOf(error))
    return { success: false, id, message: messageOf(error) }
  }
}

/**
 * Updates the admin's login credentials (username and/or password).
 * Current password is required for confirmation.
 *
 * @param {{ currentPassword: string, newUsername?: string, newPassword?: string }} data
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<{ success: boolean, admin: object|null, message?: string }>}
 */
export async function updateAdminCredentials(data, token) {
  try {
    if (!data || typeof data !== 'object') {
      return { success: false, admin: null, message: 'Missing credentials payload' }
    }
    const body = unwrap(await api.put('/admin/credentials', data, withAuth(token)))
    return { success: Boolean(body.success), admin: body.admin || null, message: body.message }
  } catch (error) {
    console.warn('[SkyCode API]', 'updateAdminCredentials failed:', messageOf(error))
    return { success: false, admin: null, message: messageOf(error) }
  }
}

/**
 * Fetches public contact details from `GET /api/settings`.
 *
 * @returns {Promise<{ email: string, whatsapp: string, website: string, location: string }>}
 */
export async function getSettings() {
  try {
    const body = unwrap(await api.get('/settings'))
    return (
      body.data || { email: '', whatsapp: '', website: '', location: '' }
    )
  } catch (error) {
    console.warn('[SkyCode API]', 'getSettings failed:', messageOf(error))
    return { email: '', whatsapp: '', website: '', location: '' }
  }
}

/**
 * Updates contact details from the admin settings page.
 *
 * @param {object} data  - { email, whatsapp, website, location }
 * @param {string} token - Admin JWT (Bearer token).
 * @returns {Promise<{ success: boolean, data: object|null, message?: string }>}
 */
export async function updateSettings(data, token) {
  try {
    if (!data || typeof data !== 'object') {
      return { success: false, data: null, message: 'Missing settings payload' }
    }
    const body = unwrap(await api.put('/settings', data, withAuth(token)))
    return { success: Boolean(body.success), data: body.data || null, message: body.message }
  } catch (error) {
    console.warn('[SkyCode API]', 'updateSettings failed:', messageOf(error))
    return { success: false, data: null, message: messageOf(error) }
  }
}

export default api