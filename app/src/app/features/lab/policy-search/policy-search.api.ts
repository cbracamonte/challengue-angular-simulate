import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PolicySearchResult } from './policy-search.model';

const MOCK_RESULTS: Record<string, PolicySearchResult[]> = {
  ana: [{ id: 'POL-1', holderName: 'Ana Beatriz Ríos', policyNumber: 'AR-2044' }],
  an: [
    { id: 'POL-1', holderName: 'Ana Beatriz Ríos', policyNumber: 'AR-2044' },
    { id: 'POL-2', holderName: 'Andrés Molina', policyNumber: 'AR-1980' },
  ],
};

/** Simula el buscador de pólizas por titular (backend real: query con LIKE, latencia variable). */
@Injectable({ providedIn: 'root' })
export class PolicySearchApi {
  search(term: string): Observable<PolicySearchResult[]> {
    return of(MOCK_RESULTS[term] ?? []).pipe(delay(300));
  }
}
