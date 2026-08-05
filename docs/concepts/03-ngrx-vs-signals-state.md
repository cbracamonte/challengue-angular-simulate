# 03 — NgRx vs Signals: el JD pide "o", no "reemplazar"

## El error de junior en la entrevista

Pregunta: "¿Migrarías este store de NgRx a Signals?"
Respuesta de junior: "Sí, Signals es lo nuevo, siempre conviene."

Esa respuesta demuestra que sabés que Signals existe, no que sabés diseñar
arquitectura de estado. El JD dice explícitamente **"NgRx o Signals"** — es
una decisión de trade-offs, no una carrera hacia lo último.

## Cuándo NgRx sigue siendo la opción correcta

- Estado compartido entre muchos módulos/features no relacionados
  directamente entre sí.
- Necesitás **time-travel debugging** o un log auditable de cada acción
  (típico en dominios regulados — como una aseguradora).
- Efectos coordinados complejos: una acción dispara 3 side-effects que a su
  vez pueden disparar más acciones, con necesidad de cancelación/reintento
  centralizados (`createEffect` + operadores RxJS).
- El equipo ya lo domina y migrar tiene costo real sin beneficio funcional
  inmediato — deuda técnica no es "código viejo", es "código que cuesta más
  de lo que debería mantener". Un store NgRx bien escrito no es deuda
  técnica solo por no ser Signals.

## Cuándo Signals gana

- Estado de componente o de una feature acotada, sin necesidad de
  debugging temporal.
- Derivaciones simples (`computed`) en vez de selectores + memoización
  manual.
- Menos boilerplate: no hay actions/reducers/effects para un contador de
  UI o un filtro de tabla.

## No son excluyentes

```ts
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Leer un slice de NgRx como signal, sin migrar el store entero:
protected readonly policies = toSignal(this.store.select(selectPolicies), { initialValue: [] });

// Derivar un signal local y devolverlo a RxJS si algo aguas abajo lo necesita:
private readonly filter$ = toObservable(this.filterSignal);
```

Esto es clave para un refactor incremental real: podés introducir Signals
en componentes nuevos SIN tocar el store NgRx existente, y migrar módulo por
módulo cuando el costo/beneficio lo justifique — exactamente el enfoque que
el JD pide ("reducir deuda técnica... sin comprometer la calidad").

## El bug de memoización que sí importa

```ts
export const selectPolicySummaries = createSelector(
  selectPolicies,
  (policies) => policies.map(p => ({ id: p.id, label: `${p.holderName} — ${p.premium}` })), // ⚠️
);
```

`createSelector` memoiza por referencia de los INPUTS (`selectPolicies`),
no por el resultado del `.map()`. Si `selectPolicies` emite un array con
el mismo contenido pero nueva referencia (común tras cualquier acción que
toque el store, aunque no afecte a `policies`), este selector recalcula y
devuelve un array NUEVO cada vez — invalidando cualquier
`OnPush`/`distinctUntilChanged` que dependa de él aguas abajo. El fix es
memoizar el resultado del map también (selector adicional, o `createSelector`
en cascada), no solo el input.

## Práctica

`app/src/app/features/lab/incidents-store/` — mismo criterio de composición
reactiva, aplicado sin NgRx (con `toSignal` + `forkJoin`), para que
compares el nivel de ceremonia.
