import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PolicySearchApi } from '../policy-search.api';
import { PolicySearchResult } from '../policy-search.model';

/**
 * Versión legacy (Angular 14-18, sin signals): DI por constructor y los
 * resultados quedan en un campo público plano que el componente lee
 * directo (sin `computed`/`OnPush` de por medio). Usa `mergeMap` — el bug
 * real de este archivo: condición de carrera si el usuario escribe rápido.
 *
 * No editar: es la referencia de "lo que hay en producción".
 */
@Injectable({ providedIn: 'root' })
export class PolicySearchLegacyService {
  results: PolicySearchResult[] = [];

  private readonly term$ = new Subject<string>();

  constructor(private readonly api: PolicySearchApi) {
    this.term$.pipe(mergeMap((term) => this.api.search(term))).subscribe((results) => {
      this.results = results;
    });
  }

  search(term: string): void {
    this.term$.next(term);
  }
}
