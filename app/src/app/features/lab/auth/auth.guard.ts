import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStore } from './token-store';

/**
 * TODO — Refactor Lab · Ejercicio 3 (parte 2: guard)
 *
 * Si TokenStore.isAuthenticated() es true, devolvé true.
 * Si no, devolvé un UrlTree hacia '/login' con Router.createUrlTree(['/login'])
 * — NO uses router.navigate() + return false (ver el bug en
 * legacy/auth.legacy-guard.ts).
 *
 * Corré: pnpm test --include='**\/auth.guard.spec.ts'
 */
export const authGuard: CanActivateFn = () => {
  const tokenStore = inject(TokenStore);
  const router = inject(Router);

  // TODO: usar router.createUrlTree(['/login']) cuando no esté autenticado.
  return tokenStore.isAuthenticated();
};
