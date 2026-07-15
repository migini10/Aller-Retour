import { getApiUrl } from '@/lib/config';

const API_URL = getApiUrl();

export class ApiClient {
  private static getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('ar_auth_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  static async get<T = any>(path: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_URL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {}
      const error: any = new Error(errorData?.message || `GET ${path} failed with status ${res.status}`);
      error.response = { data: errorData };
      throw error;
    }

    return res.json();
  }

  static async post<T = any>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {}
      const error: any = new Error(errorData?.message || `POST ${path} failed with status ${res.status}`);
      error.response = { data: errorData };
      throw error;
    }

    // Attempt to parse JSON, if it's empty return true
    try {
      return await res.json();
    } catch {
      return true;
    }
  }

  static async patch<T = any>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {}
      const error: any = new Error(errorData?.message || `PATCH ${path} failed with status ${res.status}`);
      error.response = { data: errorData };
      throw error;
    }

    try {
      return await res.json();
    } catch {
      return true;
    }
  }

  static async put<T = any>(path: string, body?: any): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {}
      const error: any = new Error(errorData?.message || `PUT ${path} failed with status ${res.status}`);
      error.response = { data: errorData };
      throw error;
    }

    try {
      return await res.json();
    } catch {
      return true;
    }
  }

  static async delete<T = any>(path: string): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {}
      const error: any = new Error(errorData?.message || `DELETE ${path} failed with status ${res.status}`);
      error.response = { data: errorData };
      throw error;
    }

    try {
      return await res.json();
    } catch {
      return true;
    }
  }
}
