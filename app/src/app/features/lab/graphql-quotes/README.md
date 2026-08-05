# Ejercicio 4 — graphql-quotes: REST vs GraphQL con rxResource

## Contexto

`quotes-rest.api.ts` simula un endpoint REST típico: devuelve el objeto
completo (`internalRiskScore`, `underwriterNotes` incluidos) aunque la UI
solo necesite 4 campos. `quotes-graphql.api.ts` simula una query GraphQL que
ya devuelve exactamente la forma que la UI necesita.

## Tu tarea

Completá `quotes-store.ts` hasta que pase:

```bash
pnpm test --include='**/quotes-store.spec.ts'
```

- `restQuotes`: llamá a `restApi.fetchByCustomer(customerId)` y **mapeá**
  el resultado a `QuoteSummary` (solo los 4 campos) — ese mapeo del lado
  cliente ES el punto del ejercicio.
- `graphqlQuotes`: llamá a `graphqlApi.fetchByCustomer(customerId)` — no
  hace falta mapear nada.
- `selectCustomer()` ya está implementado: cambia `customerId`, lo que
  dispara automáticamente una nueva carga en ambos resources (por eso
  `params: () => this.customerId()` en cada `rxResource`).

## Pista

```ts
stream: ({ params }) =>
  this.restApi.fetchByCustomer(params).pipe(
    map((quotes) => quotes.map(({ id, product, monthlyPremium, coverageAmount }) => ({
      id, product, monthlyPremium, coverageAmount,
    }))),
  ),
```

## Si te trabás 30+ minutos

`docs/concepts/06-rest-vs-graphql.md` tiene el mismo caso resuelto con la
explicación de over-fetching/under-fetching y cuándo GraphQL realmente vale
la pena frente a REST.
