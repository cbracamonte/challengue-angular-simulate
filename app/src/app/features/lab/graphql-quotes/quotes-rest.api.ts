import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RestQuote } from './quote.model';

const REST_QUOTES: RestQuote[] = [
  {
    id: 'Q-1',
    product: 'Auto',
    monthlyPremium: 45,
    coverageAmount: 15000,
    internalRiskScore: 0.32,
    underwriterNotes: 'Cliente sin siniestros previos',
  },
  {
    id: 'Q-2',
    product: 'Hogar',
    monthlyPremium: 30,
    coverageAmount: 80000,
    internalRiskScore: 0.18,
    underwriterNotes: 'Zona de bajo riesgo',
  },
];

/**
 * Simula un endpoint REST típico: devuelve el objeto completo del backend
 * (internalRiskScore, underwriterNotes) aunque la UI solo necesite 4 campos.
 * Over-fetching real, no solo teórico.
 */
@Injectable({ providedIn: 'root' })
export class QuotesRestApi {
  fetchByCustomer(_customerId: string): Observable<RestQuote[]> {
    return of(REST_QUOTES);
  }
}
