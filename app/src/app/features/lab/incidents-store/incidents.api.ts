import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Incident } from './incident.model';

const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-1', title: 'Timeout al emitir póliza', severity: 'high', assigneeId: 'u1', status: 'open' },
  { id: 'INC-2', title: 'Cálculo de prima incorrecto', severity: 'medium', assigneeId: 'u2', status: 'open' },
  { id: 'INC-3', title: 'Adjunto de siniestro no sube', severity: 'low', assigneeId: 'u1', status: 'open' },
];

/** Simula el endpoint REST de incidencias (módulo "gestión de incidencias" del JD). */
@Injectable({ providedIn: 'root' })
export class IncidentsApi {
  fetchIncidents(): Observable<Incident[]> {
    return of(MOCK_INCIDENTS);
  }
}

const MOCK_ASSIGNEES: Record<string, string> = {
  u1: 'Marina Sosa',
  u2: 'Tomás Vera',
};

/** Simula un segundo endpoint (típico caso de "necesito otro request por cada item"). */
@Injectable({ providedIn: 'root' })
export class AssigneesApi {
  fetchAssigneeName(userId: string): Observable<string> {
    return of(MOCK_ASSIGNEES[userId] ?? 'Sin asignar');
  }
}
