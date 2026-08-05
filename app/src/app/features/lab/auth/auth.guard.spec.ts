import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { TokenStore } from './token-store';

function runGuard() {
  return TestBed.runInInjectionContext(() =>
    authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('authGuard (objetivo — hacé pasar estos tests)', () => {
  it('permite navegar cuando hay sesión activa', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TokenStore, useValue: { isAuthenticated: () => true } }],
    });

    expect(runGuard()).toBeTrue();
  });

  it('redirige a /login con un UrlTree cuando no hay sesión (no con navigate imperativo)', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: TokenStore, useValue: { isAuthenticated: () => false } }],
    });

    const result = runGuard();
    expect(result instanceof UrlTree).toBeTrue();
    expect((result as UrlTree).toString()).toBe('/login');
  });
});
