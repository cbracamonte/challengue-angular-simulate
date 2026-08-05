import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApi } from './auth.api';
import { TokenStore } from './token-store';

/**
 * Fundamento teórico (docs oficiales de Angular — API `HttpInterceptorFn` /
 * `HttpHandlerFn`): un interceptor funcional recibe el `HttpRequest`
 * original y un `next: HttpHandlerFn` que representa "el resto de la
 * cadena" (el siguiente interceptor o el backend real). Los objetos
 * `HttpRequest` son inmutables por diseño, por eso `req.clone(...)` es
 * obligatorio para adjuntar el header `Authorization` — nunca se muta el
 * request original. `next(...)` devuelve un Observable de eventos HTTP, así
 * que el flujo completo (incluido el reintento tras refrescar el token) se
 * compone con operadores RxJS (`catchError` + `switchMap`) en vez de
 * callbacks anidados.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStore);
  const authApi = inject(AuthApi);

  const token = tokenStore.accessToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // La URL del request ORIGINAL (no del clon) es la que distingue
      // "necesito refrescar" de "el propio refresh falló" — sin este
      // chequeo se repite el loop infinito del legacy.
      const isRefreshCall = req.url.includes('/auth/refresh');
      if (error.status !== 401 || isRefreshCall) {
        return throwError(() => error);
      }

      return authApi.refresh(tokenStore.refreshTokenValue ?? '').pipe(
        switchMap((tokens) => {
          tokenStore.setTokens(tokens.accessToken, tokens.refreshToken);
          const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } });
          return next(retryReq);
        }),
      );
    }),
  );
};
