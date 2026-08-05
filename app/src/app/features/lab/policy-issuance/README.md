# Ejercicio 7 — policy-issuance: retry sin backoff

## Contexto

`legacy/policy-issuance-legacy.service.ts` es la versión que "heredaste":
reintento manual recursivo, con un límite de 3 intentos hardcodeado y
**sin ninguna espera entre intentos**. `policy-issuance.store.ts` (el que
tenés que arreglar) usa el operador `retry(3)` de RxJS — se ve más
"moderno", pero tiene el mismo problema de fondo: sin backoff, si el
backend está momentáneamente caído, tres reintentos casi instantáneos
pueden ser lo que le impida recuperarse.

No edites `legacy/`. Es la referencia de "lo que hay en producción".

## Tu tarea

Completá `policy-issuance.store.ts` hasta que pase:

```bash
pnpm test --include='**/policy-issuance.store.spec.ts'
```

El test simula un backend que falla las primeras 2 veces y responde bien a
la 3ra, y verifica dos cosas: (1) que el resultado final sea `'success'`
(el reintento funciona), y (2) que el tiempo entre intentos **crece** —
no un delay fijo, backoff exponencial real.

## Pista (no la solución)

`retry(3)` es azúcar sintáctico de `retry({ count: 3 })` — sin `delay`,
reintenta apenas falla, sin esperar nada:

```ts
retry({
  count: 3,
  delay: (error, retryCount) => timer(2 ** retryCount * 40), // 80ms, 160ms, ...
}),
```

`delay` puede ser un número fijo o una función que devuelve un
"notifier": cuando ESE observable emite, recién ahí se reintenta.
`timer(ms)` es la forma más simple de ese notifier.

## Si te trabás 30+ minutos

`docs/concepts/02-rxjs-memory-leaks.md` cubre el mismo eje de "elegir el
operador correcto según la garantía que necesitás", aplicado a leaks en
vez de resiliencia ante fallos.
