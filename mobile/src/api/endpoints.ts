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
