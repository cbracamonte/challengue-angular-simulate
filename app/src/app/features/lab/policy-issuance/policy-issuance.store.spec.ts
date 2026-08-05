import { TestBed } from '@angular/core/testing';
import { defer, of, throwError } from 'rxjs';
import { PolicyIssuanceStore } from './policy-issuance.store';
import { PolicyIssuanceApi } from './policy-issuance.api';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('PolicyIssuanceStore (objetivo — hacé pasar este test)', () => {
  // Zoneless (sin zone.js) → tiempos reales con async/await, no fakeAsync/tick.
  it('reintenta con backoff exponencial: cada intento espera más que el anterior', async () => {
    const timestamps: number[] = [];
    let callCount = 0;

    const apiMock: Partial<PolicyIssuanceApi> = {
      // defer() es clave: cada re-suscripción de retry() tiene que volver a
      // EJECUTAR esta función (como un HttpClient real, que hace un request
      // nuevo por cada subscribe), no reusar un Observable ya resuelto.
      submit: (policyId: string) =>
        defer(() => {
          timestamps.push(Date.now());
          callCount++;
          // Falla las primeras 2 veces, funciona a la 3ra.
          return callCount < 3
            ? throwError(() => new Error('network blip'))
            : of({ policyId, status: 'issued' as const });
        }),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: PolicyIssuanceApi, useValue: apiMock }],
    });
    const store = TestBed.inject(PolicyIssuanceStore);

    store.submit('POL-1');
    await wait(500); // tiempo de sobra para que terminen los reintentos

    expect(store.status()).toBe('success');
    expect(timestamps.length).toBe(3);

    const firstGap = timestamps[1] - timestamps[0];
    const secondGap = timestamps[2] - timestamps[1];

    // Prueba que HUBO backoff real (no reintento inmediato)...
    expect(firstGap).toBeGreaterThanOrEqual(50);
    // ...y que crece exponencialmente, no es un delay fijo.
    expect(secondGap).toBeGreaterThan(firstGap);
  });
});
