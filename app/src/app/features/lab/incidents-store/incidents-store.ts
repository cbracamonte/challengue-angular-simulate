import { Injectable, inject, signal } from '@angular/core';
import { AssigneesApi, IncidentsApi } from './incidents.api';
import { IncidentWithAssignee } from './incident.model';

/**
 * TODO — Refactor Lab · Ejercicio 2
 *
 * Reemplazá `incidents` por una sola cadena reactiva (switchMap + forkJoin)
 * que resuelva cada incidente con su assigneeName, sin subscribe anidado.
 * Corré: pnpm test --include='**\/incidents-store.spec.ts'
 *
 * Pista: fetchIncidents() te da Incident[]; por cada uno necesitás llamar a
 * assigneesApi.fetchAssigneeName(incident.assigneeId). forkJoin permite
 * esperar un array de Observables a la vez. toSignal(..., { initialValue: [] })
 * te da el resultado como signal.
 */
@Injectable({ providedIn: 'root' })
export class IncidentsStore {
  private readonly incidentsApi = inject(IncidentsApi);
  private readonly assigneesApi = inject(AssigneesApi);

  readonly incidents = signal<IncidentWithAssignee[]>([]);
}
