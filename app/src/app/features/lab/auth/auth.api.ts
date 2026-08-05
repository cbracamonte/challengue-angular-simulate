import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly http = inject(HttpClient);

  refresh(refreshToken: string): Observable<TokenPair> {
    return this.http.post<TokenPair>('/auth/refresh', { refreshToken });
  }
}
