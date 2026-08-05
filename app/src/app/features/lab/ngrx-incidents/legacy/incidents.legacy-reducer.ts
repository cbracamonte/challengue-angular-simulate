import { Action } from '@ngrx/store';
import { IncidentsActions } from '../actions';
import { IncidentsState, initialIncidentsState } from '../incident.model';

/**
 * REFERENCIA LEGACY — no la edites. Andá a incidents.reducer.ts.
 *
 * Reducer clásico con switch (estilo NgRx pre-createReducer). Funciona,
 * pero MUTA el estado anterior en vez de devolver uno nuevo — rompe la
 * regla #1 de Redux/NgRx: el reducer tiene que ser puro. Consecuencia real:
 * si despachás "load" dos veces, el array de incidentes crece con
 * duplicados en vez de reemplazarse, y como la referencia del objeto state
 * nunca cambia, cualquier selector/computed que dependa de detectar
 * "cambió la referencia" no se entera del cambio.
 */
export function incidentsLegacyReducer(
  state: IncidentsState = initialIncidentsState,
  action: Action,
): IncidentsState {
  switch (action.type) {
    case IncidentsActions.loadIncidents.type:
      state.loading = true; // BUG: mutación directa
      return state; // BUG: misma referencia

    case IncidentsActions.loadIncidentsSuccess.type: {
      const { incidents } = action as ReturnType<typeof IncidentsActions.loadIncidentsSuccess>;
      state.incidents.push(...incidents); // BUG: push en vez de reemplazar
      state.loading = false;
      return state; // BUG: misma referencia, siempre
    }

    default:
      return state;
  }
}
