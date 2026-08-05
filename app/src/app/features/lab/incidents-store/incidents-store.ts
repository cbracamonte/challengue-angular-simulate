import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { AssigneesApi, IncidentsApi } from './incidents.api';
import { IncidentWithAssignee } from './incident.model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map, switchMap } from 'rxjs';

/**
 * Fundamento teórico: en vez de un subscribe anidado (ver el bug real en
 * legacy/incidents.legacy.service.ts), esta cadena resuelve todo con
 * operadores de composición, sin gestión manual de suscripciones.
 *
 * `switchMap` (docs oficiales de RxJS): transforma cada array de incidentes
 * emitido en UN solo observable interno (el `forkJoin`), desuscribiéndose
 * del interno anterior si el observable externo volviera a emitir — así
 * una carga vieja nunca puede pisar a una más reciente.
 *
 * `forkJoin` (docs oficiales de RxJS): se suscribe a TODOS los observables
 * del array en paralelo y espera a que TODOS completen, emitiendo un único
 * array con el último valor de cada uno. Funciona naturalmente acá porque
 * cada `fetchAssigneeName(...)` es un request finito (HTTP-like, completa
 * tras emitir), no un stream continuo.
 *
 * `toSignal(..., { initialValue: [] })` (docs oficiales de Angular — RxJS
 * interop): se comporta como el `async` pipe pero utilizable fuera de un
 * template — se suscribe automáticamente y se desuscribe solo cuando el
 * servicio se destruye, sin necesidad de un `subscribe()` manual.
 */
@Injectable({ providedIn: 'root' })
export class IncidentsStore {
  private readonly incidentsApi = inject(IncidentsApi);
  private readonly assigneesApi = inject(AssigneesApi);
  private readonly destroyRef = inject(DestroyRef);

  readonly incidents = toSignal(
    this.incidentsApi.fetchIncidents().pipe(
      takeUntilDestroyed(this.destroyRef),
      map((incidents) => incidents.map((incident) => ({ ...incident, assigneeName: '' }))),
      switchMap((incidents) => {
        return forkJoin(
          incidents.map((incident) =>
            this.assigneesApi
              .fetchAssigneeName(incident.assigneeId)
              .pipe(map((name) => ({ ...incident, assigneeName: name }))),
          ),
        );
      }),
    ),
    {
      initialValue: [] 
    }
  );
}
