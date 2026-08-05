import { IncidentsActions } from './actions';
import { incidentsReducer } from './incidents.reducer';
import { Incident, initialIncidentsState } from './incident.model';

const sampleIncidents: Incident[] = [
  { id: 'INC-1', title: 'Timeout al emitir póliza', severity: 'high', status: 'open' },
];

describe('incidentsReducer (objetivo — hacé pasar estos tests)', () => {
  it('loadIncidentsSuccess reemplaza los incidentes, no hace push', () => {
    const state1 = incidentsReducer(initialIncidentsState, IncidentsActions.loadIncidentsSuccess({ incidents: sampleIncidents }));
    const state2 = incidentsReducer(state1, IncidentsActions.loadIncidentsSuccess({ incidents: sampleIncidents }));

    // Si el reducer hiciera push (bug legacy), esto tendría 2 elementos duplicados.
    expect(state2.incidents.length).toBe(1);
  });

  it('devuelve una referencia de estado NUEVA en cada acción (reducer puro)', () => {
    const nextState = incidentsReducer(initialIncidentsState, IncidentsActions.loadIncidents());
    expect(nextState).not.toBe(initialIncidentsState);
  });

  it('loadIncidentsFailure guarda el error y apaga loading', () => {
    const loadingState = incidentsReducer(initialIncidentsState, IncidentsActions.loadIncidents());
    const nextState = incidentsReducer(loadingState, IncidentsActions.loadIncidentsFailure({ error: 'network error' }));

    expect(nextState.loading).toBeFalse();
    expect(nextState.error).toBe('network error');
  });
});
