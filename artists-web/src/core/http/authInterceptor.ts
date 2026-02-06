import { authService } from '@/core/auth/auth.service';
import { config } from '@/core/config';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = authService.getToken();

  // Se token expirou, tenta renovar
  if (token && authService.isTokenExpired()) {
    try {
      await authService.refreshToken();
    } catch (error) {
      authService.logout();
      throw error;
    }
  }

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Se 401, token inválido - fazer logout
  if (response.status === 401) {
    authService.logout();
    throw new Error('Não autorizado');
  }

  return response;
}

export const httpClient = {
  async get<T>(url: string): Promise<T> {
    const response = await fetchWithAuth(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async post<T>(url: string, body: any): Promise<T> {
    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async put<T>(url: string, body: any): Promise<T> {
    const response = await fetchWithAuth(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(url: string): Promise<void> {
    const response = await fetchWithAuth(url, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  },
};
