# 07 — SASS, Tailwind y Angular Material conviviendo (con un gotcha real)

## El gotcha que vas a pisar si copiás la doc de Tailwind sin pensar

La guía oficial de Tailwind CSS v4 para instalar en cualquier framework
dice: agregá `@import "tailwindcss";` a tu hoja de estilos global. Si tu
proyecto Angular usa SCSS (como pide el JD — "SASS/LESS"), copiar eso
literalmente a `styles.scss` **rompe el build**.

### Por qué

Sass procesa `@import "algo";` como SU PROPIA sintaxis de import de
partials **antes** de que el archivo llegue a PostCSS. `"tailwindcss"` no
es un partial Sass válido (no hay un archivo `_tailwindcss.scss` en ningún
lado) — Sass tira error de resolución, PostCSS nunca llega a verlo.

### El fix (aplicado en este mismo proyecto)

Separar el import de Tailwind en un archivo `.css` plano — que Sass nunca
toca — y registrarlo como hoja de estilos global aparte:

```
src/tailwind.css       →  @import "tailwindcss";
src/styles.scss        →  @use '@angular/material' as mat; (theming)
angular.json  → "styles": ["src/tailwind.css", "src/styles.scss"]
```

## Criterio de convivencia (no es "elegí uno")

Un proyecto enterprise real —como el de este JD— casi nunca usa una sola
herramienta de estilos. El criterio que un senior aplica:

| Herramienta | Para qué |
|---|---|
| **Angular Material** | Componentes complejos con accesibilidad resuelta (date pickers, tablas, diálogos, menús) — no reinventes un combobox accesible desde cero. |
| **Tailwind** | Layout, spacing, utilidades rápidas de UI a medida — iteración veloz sin nombrar cada clase. |
| **SCSS** | Design tokens, mixins, el theming de Angular Material (`@use '@angular/material' as mat`), y estilos muy específicos de marca que no encajan en utilidades. |

Mezclarlas sin criterio → especificidad CSS impredecible y guerra de
`!important`. Mezclarlas CON criterio (como este proyecto) → cada
herramienta resuelve lo que mejor resuelve.

## Nota de sintaxis: `!important` en Tailwind v4

Tailwind v3 usaba prefijo: `!flex`. Tailwind v4 cambió a **sufijo**:
`flex!`. Si copiás ejemplos viejos de Stack Overflow o de tu memoria de
proyectos anteriores, vas a escribir la sintaxis vieja sin darte cuenta —
el linter de Tailwind (`suggestCanonicalClasses`) te lo va a marcar, pero
es mejor saberlo de entrada.

## Práctica

`app/src/app/app.component.html` usa Material (`mat-toolbar`, `mat-icon`)
+ Tailwind (utilidades de layout) al mismo tiempo — mirá el código real.
