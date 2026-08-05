import { Injectable, inject, signal } from '@angular/core';
import { catchError, of, retry, timer } from 'rxjs';
import { PolicyIssuanceApi } from './policy-issuance.api';
import { IssuanceResult } from './policy-issuance.model';

export type IssuanceStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Fundamento teórico (docs oficiales de RxJS — operador `retry`): además de
 * un número simple, `retry` acepta un objeto `RetryConfig` cuya propiedad
 * `delay` puede ser una función `(error, retryCount) => ObservableInput`.
 * Esa función se re-evalúa en cada reintento y su observable resultante
 * (acá, `timer(ms)`) determina CUÁNDO se vuelve a suscribir al origen: la
 * resuscripción ocurre cuando ese notifier emite. Con `retry(3)` a secas,
 * los 3 reintentos se disparan casi instantáneamente uno tras otro — si el
 * backend está degradado, eso es tráfico adicional en el peor momento
 * posible. Escalando el delay exponencialmente con `retryCount`
 * (`2 ** retryCount * ms`) le damos al backend cada vez más tiempo para
 * recuperarse antes del siguiente intento, en vez de agravar la caída.
 */
@Injectable({ providedIn: 'root' })
export class PolicyIssuanceStore {
  private readonly api = inject(PolicyIssuanceApi);

  readonly status = signal<IssuanceStatus>('idle');
  readonly result = signal<IssuanceResult | null>(null);

  submit(policyId: string): void {
    this.status.set('submitting');
    this.api
      .submit(policyId)
      .pipe(
        retry({ count: 3, delay: (_error, retryCount) => timer(2 ** retryCount * 40) }),
        catchError(() => {
          this.status.set('error');
          return of(null);
        }),
      )
      .subscribe((result) => {
        if (result) {
          this.result.set(result);
          this.status.set('success');
        }
      });
  }
}
