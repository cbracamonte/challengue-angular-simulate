# Ejercicio 8 — live-counter: el bug que zone.js tapaba

## Contexto

`legacy/live-counter-legacy.component.ts` es código Angular 14-18 con
`zone.js`: un campo plano (`count = 0`) mutado dentro de un `setInterval`.
En un proyecto CON `zone.js` esto funciona perfecto — `zone.js` parchea
`setInterval` y dispara un chequeo de cambios automático después de cada
callback.

**Este proyecto no tiene `zone.js`** (`grep zone package.json` no devuelve
nada). Desde Angular v21, zoneless es el default — no hace falta llamar a
`provideZonelessChangeDetection()` explícitamente, simplemente no hay
`zone.js` de por medio. Eso significa que el mismo código legacy, corriendo
ACÁ, tiene un bug real: `count` se incrementa perfectamente en memoria,
pero la pantalla nunca se entera. Sin ningún error en consola — el bug
más peligroso, porque no grita.

No edites `legacy/`. Es la referencia de "lo que hay en producción" (de un
proyecto con `zone.js`, donde ese código sí es correcto).

## Tu tarea

Completá `live-counter.component.ts` (empieza con el mismo bug a
propósito) hasta que pase:

```bash
pnpm test --include='**/live-counter.component.spec.ts'
```

El test renderiza el componente, deja pasar tiempo real (sin llamar
`fixture.detectChanges()` de nuevo — en producción nadie hace eso por
vos), y verifica que la pantalla se haya actualizado sola.

## Pista (no la solución)

Un `signal()` no depende de `zone.js` ni de que algo "parchee" timers:
cuando cambia, notifica directamente al scheduler de Angular, que agenda
un re-render. Es la razón por la que Angular pudo volverse zoneless por
default sin romper la reactividad — reemplazá el campo plano por
`signal(0)` y `.update(v => v + 1)`.

## Si te trabás 30+ minutos

`docs/concepts/01-standalone-signals-migration.md` tiene el mismo eje
(campo plano vs signal) aplicado a un caso distinto, con la explicación
completa de por qué `OnPush` + signals no necesita zone.js para nada.
