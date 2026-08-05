# 02 — RxJS: cuándo hay leak de verdad y cuándo no

## El error que casi todos cometen en la entrevista

Ante cualquier `.subscribe()` sin desuscribir, la respuesta automática es
"memory leak". A veces es cierto, a veces no — y un entrevistador senior
nota la diferencia.

### Caso A: NO hay leak (aunque parezca)

```ts
ngOnInit() {
  this.http.get<Policy[]>(this.url).subscribe(data => (this.policies = data));
}
```

`HttpClient` emite un valor y **completa**. Un Observable completado libera
su subscription solo. No hay leak de subscription activa.

El riesgo real acá es otro: si el componente se destruye ANTES de que el
request resuelva, el callback igual se ejecuta y escribe sobre un
componente ya destruido (efecto zombie, no leak).

### Caso B: SÍ hay leak de verdad

```ts
ngOnInit() {
  this.policyService.watchPolicies().subscribe(data => (this.policies = data));
}
```

Si `watchPolicies()` está implementado con `interval(...)` (polling) o un
WebSocket, el Observable **nunca completa por sí solo**. Sin
`takeUntilDestroyed()` (o async pipe), esa subscription vive para siempre —
literalmente: cada vez que el componente se crea y destruye, queda un
`interval` corriendo en memoria, indefinidamente. Es el caso implementado en
`app/src/app/features/lab/policy-list/legacy/policy-list-legacy.component.ts`.

## El concepto

La pregunta correcta no es "¿hay subscribe sin unsubscribe?" sino **"¿la
fuente completa por sí sola?"**:

| Fuente | ¿Completa sola? | ¿Necesita cleanup? |
|---|---|---|
| `HttpClient.get()` | Sí, tras 1 valor | No (pero cuidado con el efecto zombie) |
| `interval()` / `timer()` repetido | No | Sí, siempre |
| WebSocket / `fromEvent()` | No | Sí, siempre |
| `Subject` que vos controlás | Depende de si llamás `.complete()` | Sí, por las dudas |

## El fix moderno

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class PolicyList {
  private readonly policyService = inject(PolicyService);

  // toSignal ya usa DestroyRef internamente — no hace falta takeUntilDestroyed
  // si el resultado final es un signal.
  protected readonly policies = toSignal(this.policyService.watchPolicies(), { initialValue: [] });
}
```

Si necesitás quedarte en Observable-land por alguna razón (ej. combinarlo
con más operadores antes de mostrarlo), `takeUntilDestroyed()` es el
operador dedicado a esto — reemplaza al patrón legacy de guardar la
`Subscription` en un campo y llamar `.unsubscribe()` en `ngOnDestroy`.

## Nested subscribe: el otro antipatrón

```ts
this.incidentsApi.fetchIncidents().subscribe(incidents => {
  incidents.forEach(incident => {
    this.assigneesApi.fetchAssigneeName(incident.assigneeId).subscribe(name => { /* ... */ });
  });
});
```

Cada subscribe interno es una subscription nueva, nunca guardada, nunca
desuscrita — y si el método se llama dos veces, los resultados de la
primera llamada pueden pisar a los de la segunda (no hay cancelación).
El fix es componer, no anidar:

```ts
fetchIncidents$.pipe(
  switchMap(incidents => forkJoin(incidents.map(i => fetchAssigneeName(i.assigneeId).pipe(
    map(name => ({ ...i, assigneeName: name })),
  )))),
);
```

`switchMap` en el nivel externo cancela la cadena anterior completa
(incluyendo los forkJoin en vuelo) si se vuelve a llamar antes de que
termine.

## Práctica

`app/src/app/features/lab/policy-list/` (leak real con interval) y
`app/src/app/features/lab/incidents-store/` (nested subscribe → forkJoin).
