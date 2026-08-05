import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { IncidentsActions } from './actions';
import { IncidentsApi } from './incidents.api';

/**
 * Fundamento teórico (docs oficiales de NgRx — guía "Effects", sección
 * "Functional Effects"): `createEffect(factory, { functional: true })`
 * permite declarar el efecto como una función standalone que recibe sus
 * dependencias (`Actions`, la API) como parámetros con `inject()` por
 * defecto, en vez de depender de una clase con constructor — más simple de
 * testear (se invoca como una función común, sin `TestBed`) y sin la
 * ceremonia de una clase `@Injectable`.
 *
 * `switchMap` (y no `mergeMap`) es la pieza clave: según la semántica de
 * RxJS, al llegar un nuevo valor del observable fuente, switchMap CANCELA
 * la suscripción interna anterior (unsubscribe) antes de suscribirse a la
 * nueva. Si `loadIncidents` se despacha de nuevo mientras el fetch anterior
 * sigue en vuelo, ese fetch viejo se descarta — así nunca puede "pisar" con
 * una respuesta desactualizada al resultado del fetch más reciente (la
 * misma condición de carrera que el legacy resuelve con un booleano manual).
 *
 * `catchError` dentro del pipe interno (no fuera de switchMap) es necesario
 * porque un efecto de NgRx es un stream de larga vida: si el error escapara
 * sin capturarse, el observable completo del efecto terminaría con error y
 * dejaría de escuchar `loadIncidents` para siempre.
 */
export const loadIncidents$ = createEffect(
  (actions$ = inject(Actions), api = inject(IncidentsApi)) =>
    actions$.pipe(
      ofType(IncidentsActions.loadIncidents),
      switchMap(() =>
        api.fetchIncidents().pipe(
          map((incidents) => IncidentsActions.loadIncidentsSuccess({ incidents })),
          catchError((error) => of(IncidentsActions.loadIncidentsFailure({ error: String(error) }))),
        ),
      ),
    ),
  { functional: true },
);
