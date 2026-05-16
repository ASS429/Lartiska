import { apiClient } from './client';

// ─── Types légers ──────────────────────────────────────────
export type Category = { id: number; name: string; slug: string; description?: string | null };
export type Service = { id: number; title: string; description?: string; price_from?: number | null; price_to?: number | null; unit?: string; category?: Category };
export type Project = { id: number; title: string; slug: string; description?: string | null; cover_image?: string | null; city?: string | null; category?: Category; images?: ProjectImage[] };
export type ProjectImage = { id: number; url: string; type?: 'image' | 'video'; before_after?: 'none' | 'before' | 'after' };
export type Quote = {
  id: number;
  reference: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: 'pending' | 'processing' | 'sent' | 'accepted' | 'rejected' | 'expired';
  service?: { id: number; title: string };
  total_amount?: number | null;
  surface_m2?: number | null;
  has_pdf?: boolean;
  sent_at?: string | null;
  accepted_at?: string | null;
  description?: string | null;
  created_at?: string;
};
export type User = { id: number; name: string; email: string; phone?: string; role: 'admin' | 'client' };

// ─── Publiques ─────────────────────────────────────────────
export const fetchCategories = () =>
  apiClient.get<{ data: Category[] }>('/categories').then((r) => r.data.data);

export const fetchServices = () =>
  apiClient.get<{ data: Service[] }>('/services').then((r) => r.data.data);

export const fetchProjects = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ data: Project[]; meta: { current_page: number; last_page: number; total: number } }>('/projects', { params }).then((r) => r.data);

export const fetchProject = (slug: string) =>
  apiClient.get<{ data: Project }>(`/projects/${slug}`).then((r) => r.data.data);

export const fetchProjectCities = () =>
  apiClient.get<{ data: string[] }>('/projects/cities').then((r) => r.data.data);

export const fetchTestimonials = (limit = 6) =>
  apiClient.get(`/testimonials?limit=${limit}`).then((r) => r.data.data);

export const fetchPublicSettings = () =>
  apiClient.get('/settings/public').then((r) => r.data.data);

export const submitQuote = (payload: Record<string, unknown>) =>
  apiClient.post('/quotes', payload).then((r) => r.data);

export const submitContact = (payload: Record<string, unknown>) =>
  apiClient.post('/contact', payload).then((r) => r.data);

// ─── Auth ──────────────────────────────────────────────────
export const login = (email: string, password: string) =>
  apiClient.post<{ data: User; token: string }>('/auth/login', { email, password, device_name: 'mobile' }).then((r) => r.data);

export const register = (payload: { name: string; email: string; password: string; password_confirmation: string; phone?: string }) =>
  apiClient.post<{ data: User; token: string; claimed_quotes?: number }>('/auth/register', { ...payload, device_name: 'mobile' }).then((r) => r.data);

export const logout = () =>
  apiClient.post('/auth/logout').then((r) => r.data);

export const fetchMe = () =>
  apiClient.get<{ data: User }>('/auth/me').then((r) => r.data.data);

// ─── Account (mes devis) ───────────────────────────────────
export const fetchMyQuotes = () =>
  apiClient.get<{ data: Quote[] }>('/account/quotes').then((r) => r.data.data);

export const fetchMyQuote = (id: number | string) =>
  apiClient.get<{ data: Quote }>(`/account/quotes/${id}`).then((r) => r.data.data);

export const respondToQuote = (id: number | string, action: 'accept' | 'reject' | 'request_changes', comment?: string) =>
  apiClient.post(`/account/quotes/${id}/respond`, { action, comment }).then((r) => r.data);

// ─── Admin ─────────────────────────────────────────────────
export const fetchAdminDashboard = () =>
  apiClient.get('/admin/dashboard').then((r) => r.data.data);

export const fetchAdminQuotes = (params: Record<string, unknown> = {}) =>
  apiClient.get<{ data: Quote[]; meta: any }>('/admin/quotes', { params }).then((r) => r.data);

export const fetchAdminQuote = (id: number | string) =>
  apiClient.get<{ data: Quote }>(`/admin/quotes/${id}`).then((r) => r.data.data);

export const updateAdminQuote = (id: number | string, payload: Record<string, unknown>) =>
  apiClient.patch(`/admin/quotes/${id}`, payload).then((r) => r.data);

export const sendQuoteToClient = (id: number | string) =>
  apiClient.post(`/admin/quotes/${id}/send-to-client`).then((r) => r.data);

export const generateQuotePdf = (id: number | string) =>
  apiClient.post(`/admin/quotes/${id}/generate-pdf`).then((r) => r.data);

// Messages admin
export const fetchAdminMessages = (params: Record<string, unknown> = {}) =>
  apiClient.get('/admin/messages', { params }).then((r) => r.data);
export const fetchAdminMessage = (id: number | string) =>
  apiClient.get(`/admin/messages/${id}`).then((r) => r.data.data);
export const markAdminMessageRead = (id: number | string) =>
  apiClient.patch(`/admin/messages/${id}/read`).then((r) => r.data);

// Categories admin
export const fetchAdminCategories = () =>
  apiClient.get('/admin/categories').then((r) => r.data.data);

// Projects admin
export const fetchAdminProjects = (params: Record<string, unknown> = {}) =>
  apiClient.get('/admin/projects', { params }).then((r) => r.data);
export const fetchAdminProject = (id: number | string) =>
  apiClient.get(`/admin/projects/${id}`).then((r) => r.data.data);
export const createAdminProject = (payload: Record<string, unknown>) =>
  apiClient.post('/admin/projects', payload).then((r) => r.data);
export const updateAdminProject = (id: number | string, payload: Record<string, unknown>) =>
  apiClient.patch(`/admin/projects/${id}`, payload).then((r) => r.data);
export const deleteAdminProject = (id: number | string) =>
  apiClient.delete(`/admin/projects/${id}`).then((r) => r.data);
export const uploadProjectImages = (projectId: number | string, files: { uri: string; name: string; type: string }[]) => {
  const form = new FormData();
  files.forEach((f) => {
    // @ts-expect-error RN FormData accepte ce format objet
    form.append('images[]', { uri: f.uri, name: f.name, type: f.type });
  });
  return apiClient.post(`/admin/projects/${projectId}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

export const setProjectCover = (projectId: number | string, imageId: number | string) =>
  apiClient.patch(`/admin/projects/${projectId}/images/${imageId}/cover`).then((r) => r.data);
export const deleteProjectImage = (projectId: number | string, imageId: number | string) =>
  apiClient.delete(`/admin/projects/${projectId}/images/${imageId}`).then((r) => r.data);
export const setImageBeforeAfter = (projectId: number | string, imageId: number | string, value: 'none' | 'before' | 'after') =>
  apiClient.patch(`/admin/projects/${projectId}/images/${imageId}/before-after`, { before_after: value }).then((r) => r.data);

// Services admin
export const fetchAdminServices = (params: Record<string, unknown> = {}) =>
  apiClient.get('/admin/services', { params }).then((r) => r.data);
export const createAdminService = (payload: Record<string, unknown>) =>
  apiClient.post('/admin/services', payload).then((r) => r.data);
export const updateAdminService = (id: number | string, payload: Record<string, unknown>) =>
  apiClient.patch(`/admin/services/${id}`, payload).then((r) => r.data);
export const deleteAdminService = (id: number | string) =>
  apiClient.delete(`/admin/services/${id}`).then((r) => r.data);

// Testimonials admin
export const fetchAdminTestimonials = (params: Record<string, unknown> = {}) =>
  apiClient.get('/admin/testimonials', { params }).then((r) => r.data);
export const createAdminTestimonial = (payload: Record<string, unknown>) =>
  apiClient.post('/admin/testimonials', payload).then((r) => r.data);
export const updateAdminTestimonial = (id: number | string, payload: Record<string, unknown>) =>
  apiClient.patch(`/admin/testimonials/${id}`, payload).then((r) => r.data);
export const deleteAdminTestimonial = (id: number | string) =>
  apiClient.delete(`/admin/testimonials/${id}`).then((r) => r.data);

// Settings admin
export const fetchAdminSettings = () =>
  apiClient.get('/admin/settings').then((r) => r.data.data);
export const updateAdminSettings = (settings: Record<string, unknown>) =>
  apiClient.put('/admin/settings', { settings }).then((r) => r.data);
