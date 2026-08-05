# Ejercicio 1 — policy-list: de NgModule legacy a Standalone + Signals

## Contexto (igual que el JD real)

`legacy/policy-list-legacy.component.ts` es el código que "heredaste": un
`@NgModule`, DI por constructor, `*ngFor`/`*ngIf`, tipado `any`, y — el bug
real — una subscription a un feed en vivo (`PolicyService.watchPolicies()`,
un `interval` que nunca completa) que **nunca se desuscribe**. Cada vez que
ese componente se crea y se destruye, queda un timer corriendo para siempre.

No edites ese archivo. Es la referencia de "lo que hay en producción".

## Tu tarea

Completá `policy-list.component.ts` (ya scaffoldeado, standalone, OnPush)
hasta que estos 3 tests pasen:

```bash
pnpm test --include='**/policy-list.component.spec.ts'
```

1. **Renderiza pólizas en vivo** — el signal `policies` tiene que reflejar
   lo que emite `policyService.watchPolicies()`.
2. **`totalPremium` es un `computed()` real** — no un valor fijo, no un
   cálculo manual en el template.
3. **No hay leak** — al destruir el componente, la subscription al feed
   tiene que cerrarse (el test lo verifica con `Subject.observed`).

## Pista (no la solución)

`toSignal(observable$, { initialValue: [] })` de
`@angular/core/rxjs-interop` resuelve los 3 puntos a la vez: crea un signal
sincronizado con el Observable Y se desuscribe solo cuando el componente se
destruye (usa `DestroyRef` internamente). Es la respuesta "senior" — pero
también es válido resolverlo con `signal()` + `effect()` +
`takeUntilDestroyed()` si preferís entender el mecanismo manual primero.

## Si te trabás 30+ minutos

Mirá `docs/concepts/01-standalone-signals-migration.md` — tiene el mismo
caso resuelto paso a paso con la explicación del porqué.

## Práctica de Git Flow (opcional pero recomendado)

```bash
git checkout -b feature/policy-list-signals
# ... resolvés el ejercicio ...
git add src/app/features/lab/policy-list/policy-list.component.ts
git commit -m "refactor(policy-list): migrar a standalone + signals"
```

Después hacete un self-code-review con el checklist de
`docs/concepts/09-gitflow-code-review.md` antes de mergear a `main`.
