import { Injectable, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { QuotesGraphqlApi } from './quotes-graphql.api';
import { QuotesRestApi } from './quotes-rest.api';
import { QuoteSummary } from './quote.model';

/**
 * TODO — Refactor Lab · Ejercicio 4
 *
 * Conectá `restQuotes` y `graphqlQuotes` a sus APIs reales usando
 * rxResource, reaccionando a `customerId`.
 *
 *  - restQuotes: llamá a restApi.fetchByCustomer(customerId) y mapeá el
 *    resultado a QuoteSummary (solo id, product, monthlyPremium,
 *    coverageAmount) — el paso de mapeo ES el punto: REST te obliga a
 *    recortar del lado cliente lo que GraphQL ya te da recortado.
 *  - graphqlQuotes: llamá a graphqlApi.fetchByCustomer(customerId) — no
 *    necesita mapeo, ya viene con la forma exacta.
 *
 * Corré: pnpm test --include='**\/quotes-store.spec.ts'
 */
@Injectable({ providedIn: 'root' })
export class QuotesStore {
  private readonly restApi = inject(QuotesRestApi);
  private readonly graphqlApi = inject(QuotesGraphqlApi);

  readonly customerId = signal('CUST-001');

  // TODO(1): reemplazá `stream` por restApi.fetchByCustomer(params) + mapeo.
  readonly restQuotes = rxResource({
    params: () => this.customerId(),
    stream: () => of([] as QuoteSummary[]),
    defaultValue: [] as QuoteSummary[],
  });

  // TODO(2): reemplazá `stream` por graphqlApi.fetchByCustomer(params).
  readonly graphqlQuotes = rxResource({
    params: () => this.customerId(),
    stream: () => of([] as QuoteSummary[]),
    defaultValue: [] as QuoteSummary[],
  });

  selectCustomer(customerId: string): void {
    this.customerId.set(customerId);
  }
}
