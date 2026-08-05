import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStore } from './token-store';

/**
 * Fundamento teórico (docs oficiales de Angular — API `CanActivateFn`): la
 * firma del guard funcional documenta explícitamente sus tres resultados
 * posibles — `true` deja continuar la navegación, `false` la cancela sin
 * más, y un `UrlTree` cancela la navegación ACTUAL y arranca una nueva
 * hacia esa URL, como una única operación de enrutamiento gestionada por
 * el propio Router. Por eso alcanza con devolver el UrlTree: no hace falta
 * (ni conviene) llamar además a `router.navigate()` — eso dispararía DOS
 * navegaciones en paralelo (la bloqueada + la manual), que es exactamente
 * el bug de legacy/auth.legacy-guard.ts.
 */
export const authGuard: CanActivateFn = () => {
  const tokenStore = inject(TokenStore);
  const router = inject(Router);

  return tokenStore.isAuthenticated() ? true : router.createUrlTree(['/login']);
};
