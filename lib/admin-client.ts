/**
 * Unified client-side API for admin operations
 * All admin CRUD should use these methods instead of direct Firestore access
 */

import type { TeamMemberData } from './content'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

// Generic fetcher with error handling
async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Request failed' }))
      return { error: errorData.error || `HTTP ${res.status}` }
    }

    const data = await res.json()
    return { data }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' }
  }
}

// Team operations
export const teamAPI = {
  list: () => apiFetch<TeamMemberData[]>('/api/team'),
  get: (id: string) => apiFetch<TeamMemberData>(`/api/team/${id}`),
  create: (data: Partial<TeamMemberData>) => apiFetch<TeamMemberData>('/api/team', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: Partial<TeamMemberData>) => apiFetch<TeamMemberData>(`/api/team/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(`/api/team/${id}`, { method: 'DELETE' }),
}

// Galgotia cab-pool signup submissions
export interface GalgotiaSubmission {
  id: string
  email: string
  fullName: string
  phone: string
  dailyTravel: string
  pickupTime: string
  pickupTimeOther?: string
  returnTime: string
  returnTimeOther?: string
  currentTravel: string
  interested: string
  submittedAt: string | null
  userAgent?: string
  ipHash?: string
}

export const galgotiaAPI = {
  list: () => apiFetch<{ submissions: GalgotiaSubmission[] }>('/api/admin/submissions/galgotia'),
  delete: (id: string) =>
    apiFetch<{ success: true }>(`/api/admin/submissions/galgotia/${id}`, { method: 'DELETE' }),
}

// Blog operations
export const blogAPI = {
  list: () => apiFetch<any[]>('/api/blogs'),
  get: (id: string) => apiFetch<any>(`/api/blogs/${id}`),
  create: (data: any) => apiFetch<any>('/api/blogs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiFetch<any>(`/api/blogs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiFetch<void>(`/api/blogs/${id}`, { method: 'DELETE' }),
}

// Category operations
export const categoryAPI = {
  list: () => apiFetch<any[]>('/api/categories'),
  get: (id: string) => apiFetch<any>(`/api/categories/${id}`),
  create: (data: { name: string; slug?: string; color?: string; description?: string }) =>
    apiFetch<any>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<{ name: string; slug: string; color: string; description: string }>) =>
    apiFetch<any>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) => apiFetch<void>(`/api/categories/${id}`, { method: 'DELETE' }),
}

// Content operations - all admin content pages
export const contentAPI = {
  // Document-based content (single documents updated with PUT)
  hero: {
    get: () => apiFetch<any>('/api/content/hero'),
    update: (data: any) => apiFetch<any>('/api/content/hero', { method: 'PUT', body: JSON.stringify(data) }),
  },
  about: {
    get: () => apiFetch<any>('/api/content/about'),
    update: (data: any) => apiFetch<any>('/api/content/about', { method: 'PUT', body: JSON.stringify(data) }),
  },
  apps: {
    get: () => apiFetch<any>('/api/content/apps'),
    update: (data: any) => apiFetch<any>('/api/content/apps', { method: 'PUT', body: JSON.stringify(data) }),
  },
  contact: {
    get: () => apiFetch<any>('/api/content/contact'),
    update: (data: any) => apiFetch<any>('/api/content/contact', { method: 'PUT', body: JSON.stringify(data) }),
  },
  social: {
    get: () => apiFetch<any>('/api/content/social'),
    update: (data: any) => apiFetch<any>('/api/content/social', { method: 'PUT', body: JSON.stringify(data) }),
  },
  images: {
    get: () => apiFetch<any>('/api/content/images'),
    update: (data: any) => apiFetch<any>('/api/content/images', { method: 'PUT', body: JSON.stringify(data) }),
  },
  safety: {
    get: () => apiFetch<any>('/api/content/safety'),
    update: (data: any) => apiFetch<any>('/api/content/safety', { method: 'PUT', body: JSON.stringify(data) }),
  },
  homepage: {
    get: () => apiFetch<any>('/api/content/homepage'),
    update: (data: any) => apiFetch<any>('/api/content/homepage', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Collection-based content (multiple documents with CRUD)
  stats: {
    list: () => apiFetch<any[]>('/api/content/stats'),
    create: (data: any) => apiFetch<any>('/api/content/stats', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/content/stats/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/content/stats/${id}`, { method: 'DELETE' }),
  },
  features: {
    list: () => apiFetch<any[]>('/api/content/features'),
    create: (data: any) => apiFetch<any>('/api/content/features', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/content/features/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/content/features/${id}`, { method: 'DELETE' }),
  },
  howItWorks: {
    list: () => apiFetch<any[]>('/api/content/how-it-works'),
    create: (data: any) => apiFetch<any>('/api/content/how-it-works', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/content/how-it-works/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/content/how-it-works/${id}`, { method: 'DELETE' }),
  },
  testimonials: {
    list: () => apiFetch<any[]>('/api/content/testimonials'),
    create: (data: any) => apiFetch<any>('/api/content/testimonials', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/content/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/content/testimonials/${id}`, { method: 'DELETE' }),
  },
  legal: {
    get: (type: string) => apiFetch<any>(`/api/content/legal?type=${type}`),
    update: (type: string, data: any) => apiFetch<any>(`/api/content/legal?type=${type}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  featuresPage: {
    list: () => apiFetch<any[]>('/api/content/features-page'),
    create: (data: any) => apiFetch<any>('/api/content/features-page', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/api/content/features-page/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/api/content/features-page/${id}`, { method: 'DELETE' }),
  },
}
