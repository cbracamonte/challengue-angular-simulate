# Ejercicio 10 — policy-form: validación duplicada vs Reactive Forms

## Contexto

`legacy/policy-form-legacy.component.ts` es código Angular 14-18 con
`[(ngModel)]` (template-driven) y validación **manual, duplicada**: una
función `canSubmit()` (lo que deshabilita el botón) y otra lógica dentro
de `submit()` (lo que realmente decide si emitir). Bug real: quedaron
desincronizadas — `submit()` se olvidó de chequear `holderName`, así que
llamarlo directo (un test, un Enter en el form, un doble-click en una
ventana de carrera) deja pasar una póliza sin titular.

No edites `legacy/`. Es la referencia de "lo que hay en producción".

## Tu tarea

Completá `policy-form.component.ts` hasta que pasen los 3 tests:

```bash
pnpm test --include='**/policy-form.component.spec.ts'
```

1. Agregale `Validators.required` a `holderName`.
2. Agregale `[Validators.required, Validators.min(1)]` a `premium`.
3. En `submit()`, si `this.form.invalid`, no emitas nada.

## Pista (no la solución)

Con Reactive Forms hay **una sola fuente de verdad** para la validez:
`form.valid`/`form.invalid`. No hay forma de que se desincronice de sí
misma — el bug de la versión legacy (dos validaciones que divergen con el
tiempo) deja de ser posible por diseño, no por disciplina del equipo.

El componente ya expone `formValue = toSignal(form.valueChanges, {...})`
para la vista previa — mismo patrón que ya usaste en el Ejercicio 1 para
leer un Observable como signal.

## Nota: ¿y las Signal Forms?

Angular tiene una API experimental (`@angular/forms/signals`) para
formularios basados 100% en signals, sin `FormGroup`. Todavía es
inestable — no la vas a encontrar en código de producción real en 2026.
Vale mencionarla en una entrevista como "sé que existe, la sigo de
lejos", pero Reactive Forms (`FormGroup`/`Validators`) sigue siendo lo
que vas a mantener en el 99% de las bases de código reales, incluida la
de este JD.

## Si te trabás 30+ minutos

`docs/concepts/01-standalone-signals-migration.md` tiene el mismo patrón
de `toSignal()` explicado en detalle.
