# 09 — Git Flow y Code Review que forma equipo

## Git Flow, la parte que se olvida

No es solo "usamos ramas `feature/*`". El modelo completo:

- **`main`**: siempre desplegable. Solo lo tocan `release/*` y `hotfix/*`.
- **`develop`**: integración continua de features terminadas.
- **`feature/*`**: sale de `develop`, vuelve a `develop`. Nunca toca `main`
  directamente.
- **`release/*`**: sale de `develop` cuando se prepara una versión;
  correcciones finales acá, luego mergea a `main` Y de vuelta a `develop`.
- **`hotfix/*`**: sale de `main` (un bug en producción no puede esperar a
  que `develop` esté listo), mergea a `main` Y a `develop`.

Confundir esto (ej. decir que las features salen de `main`) es la señal más
común de haber usado GitHub Flow simplificado y llamarlo Git Flow.

## Code review que mentorea, no solo corrige

El JD pide explícitamente mentoría. La diferencia entre un review junior y
uno senior no es LO QUE encontrás (eso lo hace un linter/SonarQube) — es
CÓMO lo comunicás.

**Comentario que no forma equipo:**
> "Cambiá este `any` por el tipo correcto."

**Comentario que sí:**
> "Este `any` en la respuesta del HTTP nos va a morder si el backend cambia
> un campo — TypeScript no nos va a avisar en compile-time, nos vamos a
> enterar en producción. ¿Le ponés la interface `PolicyResponse` que ya
> existe en `models/`? Si no está mapeado 1:1 con lo que devuelve el
> backend, agreguemos un test que lo valide."

La segunda versión explica el RIESGO concreto (no "está mal" en abstracto),
propone una solución específica, y deja la puerta abierta a que el dev
Mid opine si conoce algo que vos no. Eso es lo que se evalúa cuando el JD
dice "disposición para hacer Code Reviews constructivos".

## Checklist de self-review antes de pedir revisión

- [ ] ¿Corriste los tests localmente, no solo en tu cabeza?
- [ ] ¿El diff tiene SOLO el cambio que decís que hace? (separar refactors
      de features en commits/PRs distintos)
- [ ] ¿El mensaje de commit explica el PORQUÉ, no solo el qué? (`fix:
      cancelar request anterior en búsqueda` mejor que `fix: bug en
      búsqueda`)
- [ ] ¿Hay algo que vos mismo tuviste que pensar dos veces para entender?
      Si sí, dejá un comentario ahí ANTES de que el reviewer lo pregunte.

## Práctica

Cada ejercicio en `app/src/app/features/lab/*/README.md` sugiere crear una
rama `feature/*` y commitear con este criterio antes de "mergear" a `main`.
