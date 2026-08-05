# Ejercicio 2 — incidents-store: de nested subscribe a composición reactiva

## Contexto

`legacy/incidents.legacy.service.ts` resuelve el módulo de "gestión de
incidencias" del JD, pero con el antipatrón de RxJS más común en código
legacy: un `.subscribe()` adentro de otro `.subscribe()` para encadenar dos
requests (incidentes → nombre del asignado por incidente). Funciona, pero
deja subscriptions sueltas y es vulnerable a race conditions si se llama dos
veces seguidas.

## Tu tarea

Completá `incidents-store.ts` hasta que pase:

```bash
pnpm test --include='**/incidents-store.spec.ts'
```

El test verifica dos cosas: (1) cada incidente termina con el
`assigneeName` correcto, y (2) `fetchAssigneeName` se llama exactamente una
vez por incidente — no de más, no de menos.

## Pista

`forkJoin` espera un array de Observables y emite un array de resultados
cuando todos completan. Combinado con `switchMap` sobre el resultado de
`fetchIncidents()`, resolvés todo en una sola cadena, sin subscribe
anidado:

```ts
fetchIncidents$.pipe(
  switchMap((incidents) => forkJoin(incidents.map((i) => /* ... */))),
);
```

`toSignal(cadena$, { initialValue: [] })` te da el resultado como signal
para exponerlo en `incidents`.

## Si te trabás 30+ minutos

`docs/concepts/02-rxjs-memory-leaks.md` tiene el mismo patrón resuelto con
la explicación de por qué el nested subscribe es un problema real, no solo
estético.
