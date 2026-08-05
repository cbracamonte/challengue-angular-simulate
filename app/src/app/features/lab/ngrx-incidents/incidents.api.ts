import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Incident } from './incident.model';

const MOCK_INCIDENTS: Incident[] = [
  { id: 'INC-1', title: 'Timeout al emitir póliza', severity: 'high', status: 'open' },
  { id: 'INC-2', title: 'Cálculo de prima incorrecto', severity: 'medium', status: 'open' },
];

@Injectable({ providedIn: 'root' })
export class IncidentsApi {
  fetchIncidents(): Observable<Incident[]> {
    return of(MOCK_INCIDENTS);
  }
}
