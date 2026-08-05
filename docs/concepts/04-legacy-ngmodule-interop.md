# 04 — Convivir con NgModules en un router 100% standalone

## El dato que casi nadie sabe todavía

Desde hace un par de versiones, Angular pone `standalone: true` **por
defecto** en todo `@Component`, `@Directive` y `@Pipe` — ya no hace falta
escribirlo. Pero el código legacy de un proyecto Angular 14-18 es anterior a
ese default, así que sigue usando `@NgModule` con `declarations`.

Para que un componente conviva dentro de un `@NgModule`, tiene que optar
explícitamente:

```ts
@Component({
  selector: 'app-policy-list-legacy',
  templateUrl: './policy-list-legacy.component.html',
  standalone: false, // sin esto, no se puede declarar en un NgModule
})
export class PolicyListLegacyComponent { /* ... */ }
```

## El problema práctico: ¿cómo lo ruteás?

El Router moderno tiene dos formas de cargar algo de forma lazy:

- `loadComponent`: **solo** para componentes standalone.
- `loadChildren`: para un array de `Routes` (standalone) **o** para un
  `@NgModule` completo (compatibilidad legacy).

Si intentás `loadComponent` sobre un componente `standalone: false`, falla
en runtime. La forma correcta de rutear código legacy sin reescribirlo de
entrada:

```ts
{
  path: 'policy-list/legacy',
  loadChildren: () => import('./legacy/policy-list-legacy.module').then(m => m.PolicyListLegacyModule),
}
```

Esto es exactamente lo que vas a necesitar el primer día en un refactor
real: la app entera no se migra de una vez, así que el router tiene que
poder servir standalone y NgModule al mismo tiempo, indefinidamente si hace
falta.

## Migración asistida (para mencionar en la entrevista)

Angular tiene un schematic oficial para automatizar buena parte de esta
migración: `ng generate @angular/core:standalone`. No hace milagros (types
`any`, lógica de negocio rara, siguen necesitando ojo humano) pero convierte
mecánicamente `standalone: false` → `standalone: true` y ajusta los
`imports` de cada componente. Saber que existe — y que NO reemplaza el
trabajo de revisar cada componente — es la respuesta que separa "leí un
blog post" de "hice esto antes".

## Bonus: nombres de archivo 2016 vs 2025

Angular 22 tiene dos convenciones de nombre de archivo configurables en
`ng new --file-name-style-guide`:

- **2016** (la que probablemente vas a ver en la entrevista):
  `policy-list.component.ts`, clase `PolicyListComponent`.
- **2025** (nueva, default de `ng new` sin flag): `policy-list.ts`, clase
  `PolicyList` (sin sufijo `Component`/`Service`/etc.).

Este mismo proyecto mezcla ambos a propósito: el código de
`features/lab/*/legacy/` usa 2016 (para que se sienta como el código real
que vas a heredar); el resto del proyecto usa 2025 (lo que gener el CLI hoy
por defecto). Saber que ambas conviven — y por qué — es una buena respuesta
si te preguntan "¿por qué esta clase se llama `PolicyList` y no
`PolicyListComponent`?".

## Práctica

`app/src/app/features/lab/policy-list/legacy/` (NgModule real) +
`app/src/app/features/lab/lab.routes.ts` (el `loadChildren` que lo rutea).
