import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PolicySearchStore } from './policy-search.store';
import { PolicySearchApi } from './policy-search.api';
import { PolicySearchResult } from './policy-search.model';

const RESULTS: Record<string, PolicySearchResult[]> = {
  ana: [{ id: 'POL-1', holderName: 'Ana Beatriz Ríos', policyNumber: 'AR-2044' }],
  an: [
    { id: 'POL-1', holderName: 'Ana Beatriz Ríos', policyNumber: 'AR-2044' },
    { id: 'POL-2', holderName: 'Andrés Molina', policyNumber: 'AR-1980' },
  ],
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('PolicySearchStore (objetivo — hacé pasar este test)', () => {
  // Esta app es zoneless (no hay zone.js en package.json), así que
  // fakeAsync()/tick() no funcionan acá — dependen de zone.js/testing.
  // Con tiempos reales (async/await + setTimeout) alcanza y sigue siendo
  // determinístico: solo importa el ORDEN de resolución, no el valor exacto.
  it('descarta la respuesta obsoleta: gana la búsqueda más reciente, no la que responde primero', async () => {
    const apiMock: Partial<PolicySearchApi> = {
      // "ana" tarda más en responder (backend lento para ese término);
      // "an" —la corrección del usuario, casi inmediata— responde antes.
      search: (term: string) => of(RESULTS[term] ?? []).pipe(delay(term === 'ana' ? 80 : 20)),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: PolicySearchApi, useValue: apiMock }],
    });
    const store = TestBed.inject(PolicySearchStore);

    store.search('ana');
    await wait(5); // el usuario sigue escribiendo antes de que "ana" responda
    store.search('an');
    await wait(120); // tiempo de sobra para que ambas respondan

    expect(store.results()).toEqual(RESULTS['an']);
  });
});
