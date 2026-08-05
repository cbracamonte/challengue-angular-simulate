import { Injectable, computed, signal } from '@angular/core';

/** Store de sesión en memoria (en una app real, respaldado por almacenamiento seguro). */
@Injectable({ providedIn: 'root' })
export class TokenStore {
  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);

  readonly accessToken = this._accessToken.asReadonly();
  readonly isAuthenticated = computed(() => this._accessToken() !== null);

  get refreshTokenValue(): string | null {
    return this._refreshToken();
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
  }

  clear(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
  }
}
