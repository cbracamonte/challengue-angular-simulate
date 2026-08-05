import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PolicySearchApi } from './policy-search.api';
import { PolicySearchResult } from './policy-search.model';

/**
 * Fundamento teórico (código fuente y docs oficiales de RxJS —
 * "Higher-order Observables"): al recibir un nuevo valor de origen,
 * `switchMap` desuscribe (`unsubscribe`) el observable interno anterior
 * ANTES de suscribirse al nuevo — es la operación de "switch": solo queda
 * viva la suscripción más reciente. `mergeMap`, en cambio, deja correr todas
 * las suscripciones internas en paralelo sin cancelar ninguna.
 *
 * Para un typeahead esto es exactamente lo que hace falta: "solo importa la
 * búsqueda más reciente". Con `mergeMap`, si el usuario escribe "an" y
 * después "ana", ambos requests HTTP siguen en vuelo y pueden resolver en
 * cualquier orden — si "an" (la búsqueda vieja) responde después que "ana",
 * pisa el resultado correcto con uno obsoleto. Con `switchMap`, el request
 * de "an" se cancela apenas se dispara la búsqueda de "ana", así que jamás
 * puede llegar a sobreescribir nada.
 */
@Injectable({ providedIn: 'root' })
export class PolicySearchStore {
  private readonly api = inject(PolicySearchApi);
  private readonly term$ = new Subject<string>();

  readonly results = signal<PolicySearchResult[]>([]);

  constructor() {
    this.term$.pipe(switchMap((term) => this.api.search(term))).subscribe((results) => {
      this.results.set(results);
    });
  }

  search(term: string): void {
    this.term$.next(term);
  }
}
