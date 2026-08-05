# Ejercicio 3 — auth: interceptor + guard funcionales para OAuth2/JWT

## Contexto

`legacy/auth.legacy-interceptor.ts` y `legacy/auth.legacy-guard.ts` son la
versión de clase (Angular 14-18, `HTTP_INTERCEPTORS` multi-provider y
`CanActivate`). Ambas "funcionan" pero tienen bugs reales de producción:

- El interceptor no excluye su propia ruta de refresh → si el refresh token
  también expiró, entra en loop infinito.
- El guard hace `router.navigate()` + `return false` → dos navegaciones en
  vez de una sola vía `UrlTree`.

No edites esos archivos.

## Tu tarea

Completá `auth.interceptor.ts` y `auth.guard.ts` (funcionales, ya
scaffoldeados) hasta que pasen:

```bash
pnpm test --include='**/auth.interceptor.spec.ts'
pnpm test --include='**/auth.guard.spec.ts'
```

- **Guard**: devolvé `true` si hay sesión, o un `UrlTree` a `/login` con
  `inject(Router).createUrlTree(['/login'])` si no.
- **Interceptor**: adjuntá el Bearer token; en un 401 de un request normal,
  refrescá con `AuthApi.refresh()` y reintentá una vez; en un 401 del propio
  `/auth/refresh`, no reintentes — propagá el error.

## Si te trabás 30+ minutos

`docs/concepts/05-oauth2-jwt-interceptors-guards.md` tiene ambos patrones
resueltos con la explicación de por qué cada bug ocurre en producción.
