import { of, throwError } from 'rxjs';
import { IncidentsActions } from './actions';
import { loadIncidents$ } from './incidents.effects';
import { IncidentsApi } from './incidents.api';
import { Incident } from './incident.model';

const sampleIncidents: Incident[] = [
  { id: 'INC-1', title: 'Timeout al emitir póliza', severity: 'high', status: 'open' },
];

describe('loadIncidents$ (objetivo — hacé pasar estos tests)', () => {
  it('despacha loadIncidentsSuccess con los incidentes de la API', (done) => {
    const apiMock = { fetchIncidents: () => of(sampleIncidents) } as IncidentsApi;
    const actions$ = of(IncidentsActions.loadIncidents());

    loadIncidents$(actions$, apiMock).subscribe((action) => {
      expect(action).toEqual(IncidentsActions.loadIncidentsSuccess({ incidents: sampleIncidents }));
      done();
    });
  });

  it('despacha loadIncidentsFailure si la API falla', (done) => {
    const apiMock = { fetchIncidents: () => throwError(() => new Error('network down')) } as IncidentsApi;
    const actions$ = of(IncidentsActions.loadIncidents());

    loadIncidents$(actions$, apiMock).subscribe((action) => {
      expect(action).toEqual(IncidentsActions.loadIncidentsFailure({ error: 'Error: network down' }));
      done();
    });
  });
});
