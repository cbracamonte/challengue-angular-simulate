import { Action } from '@ngrx/store';
import { IncidentsActions } from './actions';
import { IncidentsState, initialIncidentsState } from './incident.model';

/**
 * Fundamento teórico (docs oficiales de NgRx — guía "Reducers"): un reducer
 * es una función PURA `(state, action) => newState`. NgRx (y sus selectores
 * memoizados vía `createSelector`) detectan cambios comparando la REFERENCIA
 * del objeto `state` anterior contra la nueva, no su contenido interno. Por
 * eso cada `case` devuelve un objeto nuevo con spread (`{ ...state, ... }`)
 * en vez de mutar `state` in-place: si mutáramos, la referencia no cambiaría
 * nunca y ningún selector/observador se enteraría de la actualización, aun
 * cuando los datos sí hubiesen cambiado en memoria (ver el bug real en
 * legacy/incidents.legacy-reducer.ts).
 */
export function incidentsReducer(state: IncidentsState = initialIncidentsState, action: Action): IncidentsState {
  switch (action.type) {
    case IncidentsActions.loadIncidents.type:
      return { ...state, loading: true };

    case IncidentsActions.loadIncidentsSuccess.type: {
      // REEMPLAZA el array (no push): la acción ya trae la lista completa
      // y actualizada del backend — acumular con push generaría duplicados
      // cada vez que se vuelve a disparar la carga.
      const { incidents } = action as ReturnType<typeof IncidentsActions.loadIncidentsSuccess>;
      return { ...state, incidents, loading: false };
    }

    case IncidentsActions.loadIncidentsFailure.type: {
      const { error } = action as ReturnType<typeof IncidentsActions.loadIncidentsFailure>;
      return { ...state, loading: false, error };
    }

    default:
      return state;
  }
}
