import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStore } from '../token-store';

/**
 * REFERENCIA LEGACY — no la edites. Andá a auth.guard.ts.
 *
 * Guard de clase (patrón Angular 14-18). Funciona, pero navega
 * imperativamente Y devuelve false: dispara DOS operaciones de navegación
 * (la bloqueada + la manual) en vez de una sola vía UrlTree.
 */
@Injectable()
export class AuthLegacyGuard implements CanActivate {
  constructor(
    private tokenStore: TokenStore,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.tokenStore.isAuthenticated()) {
      return true;
    }
    // BUG: navigate() + return false = dos navegaciones en vez de una.
    this.router.navigate(['/login']);
    return false;
  }
}
