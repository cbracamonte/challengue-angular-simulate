import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthApi } from '../auth.api';
import { TokenStore } from '../token-store';

/**
 * REFERENCIA LEGACY — no la edites. Andá a auth.interceptor.ts.
 *
 * Interceptor de clase (patrón Angular 14-18, registrado vía
 * HTTP_INTERCEPTORS multi-provider). Funciona para el caso feliz, pero tiene
 * el bug de producción más común en refresh-token: si el propio request de
 * refresh devuelve 401 (porque el refresh token también expiró), este mismo
 * interceptor lo intercepta OTRA VEZ y dispara OTRO refresh — loop infinito.
 */
@Injectable()
export class AuthLegacyInterceptor implements HttpInterceptor {
  constructor(
    private tokenStore: TokenStore,
    private authApi: AuthApi,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.tokenStore.accessToken();
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => error);
        }
        // BUG: no hay exclusión para la propia ruta de refresh.
        return this.authApi.refresh(this.tokenStore.refreshTokenValue ?? '').pipe(
          switchMap((tokens) => {
            this.tokenStore.setTokens(tokens.accessToken, tokens.refreshToken);
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${tokens.accessToken}` } });
            return next.handle(retryReq);
          }),
        );
      }),
    );
  }
}
