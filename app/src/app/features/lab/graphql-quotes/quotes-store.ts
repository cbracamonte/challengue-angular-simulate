import { Injectable, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { QuotesGraphqlApi } from './quotes-graphql.api';
import { QuotesRestApi } from './quotes-rest.api';
import { QuoteSummary } from './quote.model';

/**
 * Fundamento teórico (docs oficiales de Angular — API `rxResource` /
 * `RxResourceOptions`): la función `params` es una función REACTIVA — Angular
 * la reevalúa dentro de un `computed` interno, y cada vez que el valor que
 * devuelve cambia (acá, `customerId()`), vuelve a invocar `stream` con el
 * nuevo valor envuelto en `{ params }`. Esto es lo que conecta
 * `selectCustomer()` con una nueva carga en ambos resources, sin tener que
 * orquestar manualmente un `switchMap` sobre un Subject.
 *
 * El mapeo en `restQuotes` es el punto pedagógico del ejercicio: un backend
 * REST típico devuelve el recurso completo (acá, `internalRiskScore` y
 * `underwriterNotes`, campos internos que la UI no debería ver ni acoplarse
 * a ellos) y el cliente tiene que recortarlo del lado front. Un backend
 * GraphQL, en cambio, devuelve exactamente los campos que la query declaró
 * — de ahí que `graphqlQuotes` no necesite ningún paso de mapeo.
 */
@Injectable({ providedIn: 'root' })
export class QuotesStore {
  private readonly restApi = inject(QuotesRestApi);
  private readonly graphqlApi = inject(QuotesGraphqlApi);

  readonly customerId = signal('CUST-001');

  readonly restQuotes = rxResource({
    params: () => this.customerId(),
    stream: ({ params }) =>
      this.restApi.fetchByCustomer(params).pipe(
        map((quotes) =>
          quotes.map(({ id, product, monthlyPremium, coverageAmount }) => ({
            id,
            product,
            monthlyPremium,
            coverageAmount,
          })),
        ),
      ),
    defaultValue: [] as QuoteSummary[],
  });

  readonly graphqlQuotes = rxResource({
    params: () => this.customerId(),
    stream: ({ params }) => this.graphqlApi.fetchByCustomer(params),
    defaultValue: [] as QuoteSummary[],
  });

  selectCustomer(customerId: string): void {
    this.customerId.set(customerId);
  }
}
