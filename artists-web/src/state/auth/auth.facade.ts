"use client";

import { BehaviorSubject } from 'rxjs';
import { authService, AuthResponse } from '@/core/auth/auth.service';

interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: AuthTokens | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  tokens: null,
  error: null,
};

class AuthFacade {
  private state$ = new BehaviorSubject<AuthState>(initialState);

  get snapshot() {
    return this.state$.value;
  }

  get state() {
    return this.state$.asObservable();
  }

  constructor() {
    // Verificar se há token armazenado ao inicializar
    if (typeof window !== 'undefined') {
      const token = authService.getToken();
      if (token && !authService.isTokenExpired()) {
        this.state$.next({
          ...initialState,
          isAuthenticated: true,
          tokens: {
            accessToken: token,
            expiresIn: 300000,
            username: 'user',
          },
        });
      }
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    this.state$.next({ ...this.state$.value, isLoading: true, error: null });

    try {
      const response: AuthResponse = await authService.login(username, password);
      
      this.state$.next({
        isAuthenticated: true,
        isLoading: false,
        tokens: {
          accessToken: response.token,
          expiresIn: response.expiresIn,
          username: response.username,
        },
        error: null,
      });

      return true;
    } catch (error: any) {
      this.state$.next({
        ...initialState,
        isLoading: false,
        error: error.message || 'Falha na autenticação',
      });
      return false;
    }
  }

  async refresh(): Promise<string | null> {
    try {
      const response = await authService.refreshToken();
      
      this.state$.next({
        ...this.state$.value,
        tokens: {
          accessToken: response.token,
          expiresIn: response.expiresIn,
          username: response.username,
        },
      });

      return response.token;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  logout(): void {
    authService.logout();
    this.state$.next(initialState);
  }

  clearError(): void {
    this.state$.next({ ...this.state$.value, error: null });
  }
}

export const authFacade = new AuthFacade();
