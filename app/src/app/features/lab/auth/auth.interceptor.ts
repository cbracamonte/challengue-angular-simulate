import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthApi } from './auth.api';
import { TokenStore } from './token-store';

/**
 * TODO — Refactor Lab · Ejercicio 3 (parte 1: interceptor)
 *
 * Implementá:
 *  1. Si hay accessToken, adjuntalo como header Authorization: Bearer <token>.
 *  2. Si la respuesta es un 401 Y la request NO es hacia /auth/refresh,
 *     llamá a AuthApi.refresh(), guardá los tokens nuevos con
 *     TokenStore.setTokens(), y reintentá la request original UNA vez con
 *     el accessToken nuevo.
 *  3. Si la respuesta es un 401 Y la request SÍ es hacia /auth/refresh,
 *     NO reintentes — propagá el error (evita el loop infinito de
 *     legacy/auth.legacy-interceptor.ts).
 *
 * Corré: pnpm test --include='**\/auth.interceptor.spec.ts'
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStore);
  const authApi = inject(AuthApi);

  // TODO: usar tokenStore y authApi para implementar los 3 puntos de arriba.
  return next(req);
};
