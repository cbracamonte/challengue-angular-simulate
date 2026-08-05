# Ejercicio 5 — ngrx-incidents: store NgRx completo (reducer + effects)

## Contexto

`legacy/incidents.legacy-reducer.ts` y `legacy/incidents.legacy-effects.ts`
son la versión "que heredaste": un reducer que muta `state` directamente
(clásico `switch` sin spread) y un effect de clase con `.subscribe()`
anidado adentro de `.subscribe()` (el mismo antipatrón del Ejercicio 2, pero
ahora dentro de un effect de NgRx). El componente (`incidents-list.component.ts`)
despacha `loadIncidents()` **dos veces** a propósito en `ngOnInit` — con el
store legacy vas a ver incidentes duplicados en pantalla.

No edites los archivos de `legacy/`. Son la referencia de "lo que hay en
producción".

## Tu tarea

Completá `incidents.reducer.ts` e `incidents.effects.ts` (ya scaffoldeados)
hasta que pasen:

```bash
pnpm test --include='**/ngrx-incidents/**/*.spec.ts'
```

**Reducer** — reescribilo puro: cada `case` devuelve un objeto **nuevo**
(spread), nunca muta `state` in-place. `loadIncidentsSuccess` **reemplaza**
`state.incidents` por el array que viene en la acción (no hace push).
`loadIncidentsFailure` apaga `loading` y guarda `error`.

**Effects** — es un effect **funcional** (`createEffect(factory, { functional: true })`).
Reescribilo para que, en vez de anidar subscribes, use `switchMap` desde el
stream de acciones hacia `api.fetchIncidents()`, mapeando el resultado a
`loadIncidentsSuccess`/`loadIncidentsFailure` con `catchError`. Los tests
llaman al effect **directamente como función** (`loadIncidents$(actions$, apiMock)`),
no vía `TestBed`/`provideMockActions` — así es como NgRx documenta testear
effects funcionales.

## Verificación en navegador (opcional, recomendado)

Con `pnpm start`, andá a `/lab/ngrx-incidents` (target) y
`/lab/ngrx-incidents/legacy` (buggy). Mientras el reducer siga mutando vas a
ver un `TypeError: Cannot assign to read only property` en la consola — es
NgRx en modo dev rechazando la mutación, no un bug de la app. Cuando lo
arregles, el error desaparece y la ruta legacy muestra duplicados mientras
la target no.

## Pista

```ts
case IncidentsActions.loadIncidentsSuccess.type:
  return { ...state, incidents: action.incidents, loading: false };
```

```ts
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
```

## Bonus: ¿y `@ngrx/signals`?

El JD menciona "NgRx o Signals", no `createReducer`/`createEffect`
específicamente. `@ngrx/signals` (paquete separado) ofrece `signalStore()`:
mismo store centralizado y testeable, pero sin actions/reducers/effects
boilerplate — el estado es un `signal()` interno y los "effects" son
`rxMethod()`. Para un módulo con pocos consumidores y sin necesidad de
time-travel debugging, es menos ceremonia. Este ejercicio usa el NgRx
clásico a propósito porque es lo que vas a encontrar en el código legacy del
JD — pero en una entrevista, mencionar `signalStore()` como alternativa
válida (no como reemplazo automático) demuestra que conocés el trade-off,
no solo la sintaxis. Ver `docs/concepts/03-ngrx-vs-signals-state.md`.

## Si te trabás 30+ minutos

`docs/concepts/03-ngrx-vs-signals-state.md` tiene el trade-off NgRx/Signals
explicado. Para el patrón de nested-subscribe → composición reactiva, mirá
también `docs/concepts/02-rxjs-memory-leaks.md`.
