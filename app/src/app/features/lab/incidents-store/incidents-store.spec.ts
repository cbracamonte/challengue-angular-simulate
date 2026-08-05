import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IncidentsStore } from './incidents-store';
import { AssigneesApi, IncidentsApi } from './incidents.api';
import { Incident } from './incident.model';

const incidents: Incident[] = [
  { id: 'INC-1', title: 'Timeout en emisión', severity: 'high', assigneeId: 'u1', status: 'open' },
  { id: 'INC-2', title: 'Error de validación', severity: 'low', assigneeId: 'u2', status: 'open' },
];

describe('IncidentsStore (objetivo — hacé pasar estos tests)', () => {
  it('resuelve assigneeName para cada incidente en una sola cadena reactiva', () => {
    const fetchAssigneeName = jasmine
      .createSpy('fetchAssigneeName')
      .and.callFake((id: string) => of(`Nombre-${id}`));

    TestBed.configureTestingModule({
      providers: [
        { provide: IncidentsApi, useValue: { fetchIncidents: () => of(incidents) } },
        { provide: AssigneesApi, useValue: { fetchAssigneeName } },
      ],
    });

    const store = TestBed.inject(IncidentsStore);

    expect(store.incidents().map((i) => i.assigneeName)).toEqual(['Nombre-u1', 'Nombre-u2']);
    expect(fetchAssigneeName).toHaveBeenCalledTimes(2);
  });
});
