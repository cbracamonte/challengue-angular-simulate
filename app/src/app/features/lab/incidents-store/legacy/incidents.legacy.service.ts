import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssigneesApi, IncidentsApi } from '../incidents.api';
import { IncidentWithAssignee } from '../incident.model';

/**
 * REFERENCIA LEGACY — no la edites. Andá a incidents-store.ts.
 *
 * Funciona, pero tiene el antipatrón clásico de "nested subscribe":
 * en vez de componer los dos requests con switchMap + forkJoin, hace un
 * subscribe adentro de otro subscribe. Consecuencias reales:
 *  - Cada subscription interna (una por incidente) nunca se guarda ni se
 *    desuscribe.
 *  - Si loadIncidents() se llama dos veces seguidas, los resultados de la
 *    primera llamada pueden "pisar" a los de la segunda fuera de orden
 *    (race condition) porque no hay cancelación tipo switchMap.
 */
@Injectable({ providedIn: 'root' })
export class IncidentsLegacyService {
  private readonly incidentsApi = inject(IncidentsApi);
  private readonly assigneesApi = inject(AssigneesApi);
  private readonly incidents$ = new BehaviorSubject<IncidentWithAssignee[]>([]);
  readonly incidents = this.incidents$.asObservable();

  loadIncidents(): void {
    this.incidentsApi.fetchIncidents().subscribe((incidents) => {
      const withPlaceholders: IncidentWithAssignee[] = incidents.map((incident) => ({
        ...incident,
        assigneeName: '',
      }));
      this.incidents$.next(withPlaceholders);

      incidents.forEach((incident, index) => {
        // BUG: subscribe anidado, ver el comentario del JSDoc de la clase.
        this.assigneesApi.fetchAssigneeName(incident.assigneeId).subscribe((name) => {
          const current = [...this.incidents$.value];
          current[index] = { ...current[index], assigneeName: name };
          this.incidents$.next(current);
        });
      });
    });
  }
}
