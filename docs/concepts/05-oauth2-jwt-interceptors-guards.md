# 05 — Interceptores y guards funcionales: OAuth2/JWT sin loops

## De clase a función

Angular 14-18 registra interceptores como clases vía el multi-provider
`HTTP_INTERCEPTORS`:

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenStore: TokenStore) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    const token = this.tokenStore.accessToken();
    return next.handle(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
  }
}
// app.module.ts
providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }]
```

La forma moderna es una función pura, registrada con
`provideHttpClient(withInterceptors([...]))`:

```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStore = inject(TokenStore);
  const token = tokenStore.accessToken();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
```

`inject()` funciona porque Angular ejecuta la función dentro de un
"contexto de inyección" al registrarla. Menos ceremonia, sin clase, sin
`multi: true` que olvidar.

## El bug de producción #1 en refresh-token: el loop infinito

```ts
catchError((error: HttpErrorResponse) => {
  if (error.status === 401) {
    return authApi.refresh(refreshToken).pipe(
      switchMap(tokens => { /* reintentar */ }),
    );
  }
  return throwError(() => error);
}),
```

Si el REQUEST DE REFRESH también devuelve 401 (porque el refresh token
también expiró), este mismo interceptor lo intercepta OTRA VEZ y dispara
OTRO refresh. Loop infinito, consola llena de requests, el usuario nunca ve
un error claro — solo la app "colgada".

**El fix es excluir explícitamente la ruta de refresh** de la lógica de
retry:

```ts
if (error.status === 401 && !req.url.includes('/auth/refresh')) {
  // reintentar
}
return throwError(() => error);
```

En un sistema con más tráfico, además hay que evitar el "thundering herd":
si 5 requests fallan con 401 al mismo tiempo, no querés 5 refreshes en
paralelo — un `Subject` compartido que las demás requests esperan es el
patrón estándar (fuera del alcance de este ejercicio, pero mencionalo si
te preguntan "¿y si fallan varios requests a la vez?").

## Guards: `UrlTree` en vez de `navigate()` + `false`

```ts
// legacy — dos navegaciones
canActivate(): boolean {
  if (this.tokenStore.isAuthenticated()) return true;
  this.router.navigate(['/login']);
  return false;
}
```

```ts
// moderno — una sola navegación
export const authGuard: CanActivateFn = () => {
  const tokenStore = inject(TokenStore);
  return tokenStore.isAuthenticated() || inject(Router).createUrlTree(['/login']);
};
```

`false` le dice al Router "no navegues" sin decirle a dónde ir — si vos
además llamás `navigate()`, quedan dos operaciones de navegación
compitiendo. Devolver un `UrlTree` es una sola instrucción atómica:
"navegá acá en vez de a donde ibas".

## Práctica

`app/src/app/features/lab/auth/` — interceptor y guard con tests que
verifican exactamente estos dos bugs.
