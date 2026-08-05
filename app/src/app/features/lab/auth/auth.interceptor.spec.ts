import { HttpErrorResponse, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthApi } from './auth.api';
import { TokenStore } from './token-store';

function callInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return TestBed.runInInjectionContext(() => authInterceptor(req, next));
}

describe('authInterceptor (objetivo — hacé pasar estos tests)', () => {
  it('agrega el header Authorization cuando hay accessToken', (done) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStore, useValue: { accessToken: () => 'abc123' } },
        { provide: AuthApi, useValue: {} },
      ],
    });

    const req = new HttpRequest('GET', '/api/policies');
    const next: HttpHandlerFn = (r) => {
      expect(r.headers.get('Authorization')).toBe('Bearer abc123');
      return of(new HttpResponse({ status: 200 }));
    };

    callInterceptor(req, next).subscribe(() => done());
  });

  it('en un 401 de un request normal, refresca el token y reintenta una vez', (done) => {
    let callCount = 0;
    const setTokens = jasmine.createSpy('setTokens');
    const tokenStore = {
      accessToken: () => (callCount === 0 ? 'expired' : 'fresh'),
      refreshTokenValue: 'rt',
      setTokens,
    };
    const authApi = { refresh: () => of({ accessToken: 'fresh', refreshToken: 'rt2' }) };

    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStore, useValue: tokenStore },
        { provide: AuthApi, useValue: authApi },
      ],
    });

    const req = new HttpRequest('GET', '/api/policies');
    const next: HttpHandlerFn = (r) => {
      callCount++;
      if (callCount === 1) {
        return throwError(() => new HttpErrorResponse({ status: 401 }));
      }
      expect(r.headers.get('Authorization')).toBe('Bearer fresh');
      return of(new HttpResponse({ status: 200 }));
    };

    callInterceptor(req, next).subscribe({
      next: () => {
        expect(callCount).toBe(2);
        expect(setTokens).toHaveBeenCalledWith('fresh', 'rt2');
        done();
      },
      error: done.fail,
    });
  });

  it('en un 401 del propio endpoint de refresh, no reintenta (evita el loop infinito)', (done) => {
    let callCount = 0;
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenStore, useValue: { accessToken: () => 'expired', refreshTokenValue: 'rt', setTokens: () => {} } },
        { provide: AuthApi, useValue: { refresh: () => of({ accessToken: 'x', refreshToken: 'y' }) } },
      ],
    });

    const req = new HttpRequest('POST', '/auth/refresh', { refreshToken: 'rt' });
    const next: HttpHandlerFn = () => {
      callCount++;
      return throwError(() => new HttpErrorResponse({ status: 401 }));
    };

    callInterceptor(req, next).subscribe({
      next: () => done.fail('no debería emitir una respuesta exitosa'),
      error: () => {
        expect(callCount).toBe(1);
        done();
      },
    });
  });
});
