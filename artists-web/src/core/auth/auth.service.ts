import { config } from '@/core/config';

export interface AuthResponse {
  token: string;
  type: string;
  expiresIn: number;
  username: string;
}

class AuthService {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(config.tokenKey);
  }

  setToken(token: string, expiresIn: number): void {
    localStorage.setItem(config.tokenKey, token);
    const expiryTime = Date.now() + expiresIn;
    localStorage.setItem(config.tokenExpiryKey, expiryTime.toString());
  }

  clearToken(): void {
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.tokenExpiryKey);
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem(config.tokenExpiryKey);
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${config.apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Falha na autenticação');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.token, data.expiresIn);
    return data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Sem token para renovar');
    }

    const response = await fetch(`${config.apiUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      this.clearToken();
      throw new Error('Falha ao renovar token');
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.token, data.expiresIn);
    return data;
  }

  logout(): void {
    this.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

export const authService = new AuthService();
