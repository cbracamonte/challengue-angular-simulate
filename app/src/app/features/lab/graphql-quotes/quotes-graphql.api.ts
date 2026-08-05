import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QuoteSummary } from './quote.model';

const GRAPHQL_QUOTES: QuoteSummary[] = [
  { id: 'Q-1', product: 'Auto', monthlyPremium: 45, coverageAmount: 15000 },
  { id: 'Q-2', product: 'Hogar', monthlyPremium: 30, coverageAmount: 80000 },
];

/**
 * Simula una query GraphQL: el cliente declaró exactamente los 4 campos que
 * necesita (id, product, monthlyPremium, coverageAmount) y el backend
 * devuelve exactamente eso — sin campos de más, sin mapeo del lado cliente.
 *
 * En un backend real esto sería un único POST a /graphql con un `query`
 * como:
 *   query QuotesByCustomer($customerId: ID!) {
 *     quotesByCustomer(customerId: $customerId) {
 *       id product monthlyPremium coverageAmount
 *     }
 *   }
 */
@Injectable({ providedIn: 'root' })
export class QuotesGraphqlApi {
  fetchByCustomer(_customerId: string): Observable<QuoteSummary[]> {
    return of(GRAPHQL_QUOTES);
  }
}
