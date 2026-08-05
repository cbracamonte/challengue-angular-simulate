import { Injectable, inject } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { IncidentsActions } from '../actions';
import { IncidentsApi } from '../incidents.api';

/**
 * REFERENCIA LEGACY — no la edites. Andá a incidents.effects.ts.
 *
 * En vez de usar createEffect() (que NgRx gestiona: cancela en vuelo,
 * se testea con provideMockActions, se integra con el runtime de efectos),
 * esta clase se suscribe a mano en el constructor. Funciona para el caso
 * feliz, pero: (1) no cancela un fetch anterior si loadIncidents se
 * despacha de nuevo antes de que resuelva (no hay switchMap), y (2) no es
 * testeable con las herramientas estándar de @ngrx/effects/testing.
 */
@Injectable()
export class IncidentsLegacyEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(IncidentsApi);
  private readonly store = inject(Store);

  constructor() {
    // BUG: subscribe manual en vez de createEffect().
    this.actions$.pipe(ofType(IncidentsActions.loadIncidents)).subscribe(() => {
      this.api.fetchIncidents().subscribe((incidents) => {
        this.store.dispatch(IncidentsActions.loadIncidentsSuccess({ incidents }));
      });
    });
  }
}
