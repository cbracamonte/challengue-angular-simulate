# Ejercicio 6 — policy-search: condición de carrera en un typeahead

## Contexto

`legacy/policy-search-legacy.service.ts` es la versión que "heredaste": DI
por constructor, resultados en un campo público plano — y `mergeMap` para
encadenar cada término de búsqueda con la API. Funciona la mayoría del
tiempo, pero tiene una condición de carrera real: si el backend tarda más
en responder una búsqueda vieja que la nueva (típico con términos más
frecuentes o cachés fríos), la respuesta vieja puede llegar **después** y
pisar en pantalla los resultados correctos con datos obsoletos.

No edites ese archivo. Es la referencia de "lo que hay en producción".

## Tu tarea

Completá `policy-search.store.ts` (ya scaffoldeado, con el mismo bug a
propósito) hasta que pase:

```bash
pnpm test --include='**/policy-search.store.spec.ts'
```

El test simula justo ese escenario con tiempos reales (`async`/`await`,
no `fakeAsync`/`tick()` — esta app es zoneless, sin `zone.js`, y esos
helpers lo necesitan): buscás "ana" (responde más lento), corregís casi al
toque a "an" (responde antes), y verificás que el resultado final en
pantalla sea el de "an" — no el de "ana" llegando tarde.

## Pista (no la solución)

`mergeMap` deja correr TODAS las requests en paralelo, sin cancelar nada.
`switchMap` cancela automáticamente la request anterior en cuanto llega un
valor nuevo del stream — es literalmente "switch to the latest". Para un
typeahead (una sola búsqueda activa relevante a la vez), es el operador
correcto. Para casos donde SÍ querés que todas las requests en paralelo
completen (ej. subir varios archivos), `mergeMap` vuelve a ser el
adecuado — no es "switchMap siempre gana", es entender qué garantía
necesitás.

## Si te trabás 30+ minutos

`docs/concepts/02-rxjs-memory-leaks.md` cubre el mismo eje (elegir el
operador de aplanado correcto), aplicado a leaks en vez de race conditions.
