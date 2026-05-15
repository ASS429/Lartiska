import { apiClient } from './client';

// ─── Dashboard ─────────────────────────────────────────────
export const fetchAdminDashboard = () =>
  apiClient.get('/admin/dashboard').then((r) => r.data.data);

// ─── Quotes ────────────────────────────────────────────────
export const fetchAdminQuotes = (params = {}) =>
  apiClient.get('/admin/quotes', { params }).then((r) => r.data);
export const fetchAdminQuote = (id) =>
  apiClient.get(`/admin/quotes/${id}`).then((r) => r.data.data);
export const updateAdminQuote = (id, payload) =>
  apiClient.patch(`/admin/quotes/${id}`, payload).then((r) => r.data);

export const generateQuotePdf = (id) =>
  apiClient.post(`/admin/quotes/${id}/generate-pdf`).then((r) => r.data);

export const sendQuoteToClient = (id) =>
  apiClient.post(`/admin/quotes/${id}/send-to-client`).then((r) => r.data);

// ─── Messages ──────────────────────────────────────────────
export const fetchAdminMessages = (params = {}) =>
  apiClient.get('/admin/messages', { params }).then((r) => r.data);
export const fetchAdminMessage = (id) =>
  apiClient.get(`/admin/messages/${id}`).then((r) => r.data.data);
export const markAdminMessageRead = (id) =>
  apiClient.patch(`/admin/messages/${id}/read`).then((r) => r.data);

// ─── Categories ────────────────────────────────────────────
export const fetchAdminCategories = () =>
  apiClient.get('/admin/categories').then((r) => r.data.data);

// ─── Projects ──────────────────────────────────────────────
export const fetchAdminProjects = (params = {}) =>
  apiClient.get('/admin/projects', { params }).then((r) => r.data);
export const fetchAdminProject = (id) =>
  apiClient.get(`/admin/projects/${id}`).then((r) => r.data.data);
export const createAdminProject = (payload) =>
  apiClient.post('/admin/projects', payload).then((r) => r.data);
export const updateAdminProject = (id, payload) =>
  apiClient.patch(`/admin/projects/${id}`, payload).then((r) => r.data);
export const deleteAdminProject = (id) =>
  apiClient.delete(`/admin/projects/${id}`).then((r) => r.data);

export const uploadProjectImages = (id, files) => {
  const form = new FormData();
  for (const f of files) form.append('images[]', f);
  return apiClient.post(`/admin/projects/${id}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};
export const setProjectCover = (projectId, imageId) =>
  apiClient.patch(`/admin/projects/${projectId}/images/${imageId}/cover`).then((r) => r.data);

export const setImageBeforeAfter = (projectId, imageId, value) =>
  apiClient.patch(`/admin/projects/${projectId}/images/${imageId}/before-after`, { before_after: value }).then((r) => r.data);
export const deleteProjectImage = (projectId, imageId) =>
  apiClient.delete(`/admin/projects/${projectId}/images/${imageId}`).then((r) => r.data);
export const reorderProjectImages = (projectId, imageIds) =>
  apiClient.patch(`/admin/projects/${projectId}/images/reorder`, { order: imageIds }).then((r) => r.data);

// ─── Services ──────────────────────────────────────────────
export const fetchAdminServices = (params = {}) =>
  apiClient.get('/admin/services', { params }).then((r) => r.data);
export const fetchAdminService = (id) =>
  apiClient.get(`/admin/services/${id}`).then((r) => r.data.data);
export const createAdminService = (payload) =>
  apiClient.post('/admin/services', payload).then((r) => r.data);
export const updateAdminService = (id, payload) =>
  apiClient.patch(`/admin/services/${id}`, payload).then((r) => r.data);
export const deleteAdminService = (id) =>
  apiClient.delete(`/admin/services/${id}`).then((r) => r.data);

// ─── Testimonials ──────────────────────────────────────────
export const fetchAdminTestimonials = (params = {}) =>
  apiClient.get('/admin/testimonials', { params }).then((r) => r.data);
export const fetchAdminTestimonial = (id) =>
  apiClient.get(`/admin/testimonials/${id}`).then((r) => r.data.data);
export const createAdminTestimonial = (payload) =>
  apiClient.post('/admin/testimonials', payload).then((r) => r.data);
export const updateAdminTestimonial = (id, payload) =>
  apiClient.patch(`/admin/testimonials/${id}`, payload).then((r) => r.data);
export const deleteAdminTestimonial = (id) =>
  apiClient.delete(`/admin/testimonials/${id}`).then((r) => r.data);

// ─── Settings ──────────────────────────────────────────────
export const fetchAdminSettings = () =>
  apiClient.get('/admin/settings').then((r) => r.data.data);
export const updateAdminSettings = (settings) =>
  apiClient.put('/admin/settings', { settings }).then((r) => r.data);
