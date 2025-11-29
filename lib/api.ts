import { normalizeMediaUrls } from './media';

// API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://0jdbg6kb-5001.inc1.devtunnels.ms/api';

// API client class
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Content endpoints
  async getContent() {
    const data = await this.request('/content');
    // Normalize all media URLs in the response
    return normalizeMediaUrls(data);
  }

  async updateContent(content: any) {
    return this.request('/content', {
      method: 'PUT',
      body: JSON.stringify(content),
    });
  }

  async getSection(section: string) {
    const data = await this.request(`/content/${section}`);
    // Normalize all media URLs in the response
    return normalizeMediaUrls(data);
  }

  async updateSection(section: string, data: any) {
    return this.request(`/content/${section}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Media endpoints
  async getMedia() {
    const data = await this.request('/media');
    // Normalize all media URLs in the response
    return normalizeMediaUrls(data);
  }

  async uploadMedia(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const token = this.getToken();
    const response = await fetch(`${this.baseURL}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    return data;
  }

  async deleteMedia(id: string) {
    return this.request(`/media/${id}`, {
      method: 'DELETE',
    });
  }

  async getMediaStats() {
    return this.request('/media/stats');
  }

  // Inquiry endpoints
  async submitInquiry(data: {
    name: string;
    partner?: string;
    email: string;
    phone?: string;
    date?: string;
    story: string;
  }) {
    return this.request('/inquiry/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInquiries(status?: 'read' | 'unread') {
    const query = status ? `?status=${status}` : '';
    return this.request(`/inquiry${query}`);
  }

  async getInquiry(id: string) {
    return this.request(`/inquiry/${id}`);
  }

  async markInquiryAsRead(id: string) {
    return this.request(`/inquiry/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markInquiryAsUnread(id: string) {
    return this.request(`/inquiry/${id}/unread`, {
      method: 'PATCH',
    });
  }

  async deleteInquiry(id: string) {
    return this.request(`/inquiry/${id}`, {
      method: 'DELETE',
    });
  }

  async getInquiryStats() {
    return this.request('/inquiry/stats/summary');
  }
}

export const api = new ApiClient();
