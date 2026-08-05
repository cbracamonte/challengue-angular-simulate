# 06 — REST vs GraphQL: quién decide la forma de la respuesta

## El caso real

Una pantalla de "resumen de póliza" necesita: datos del titular, la póliza,
las últimas 3 incidencias, y el estado de pago. Con REST clásico, tenés dos
malas opciones:

1. **4 endpoints, 4 requests** (o encadenados con `switchMap`/`forkJoin`) —
   más latencia acumulada, más código de orquestación en el cliente.
2. **Un endpoint "resumen" a medida** que el backend arma especialmente
   para esta pantalla — funciona, pero cada pantalla nueva pide su propio
   endpoint a medida, y ese endpoint casi siempre devuelve más campos de los
   que la UI actual usa (over-fetching), porque "por si el frontend los
   necesita después".

GraphQL invierte quién decide la forma de la respuesta: el cliente declara
exactamente los campos que quiere, de las entidades que quiere, en un solo
POST.

```graphql
query PolicySummary($id: ID!) {
  policy(id: $id) {
    holderName
    premium
    status
    incidents(last: 3) { title severity }
  }
}
```

## Lo que NO es la diferencia

- No es que GraphQL sea "más rápido" por definición — depende de cómo esté
  implementado el resolver en el backend.
- No es que REST no pueda anidar datos — un JSON de REST perfectamente
  puede incluir `incidents` embebidos.
- No es "GraphQL para todo, REST para nada" — un endpoint simple de
  `GET /health` no necesita GraphQL.

## La diferencia real

**Quién controla la forma de la respuesta.** REST: el backend, por
endpoint. GraphQL: el cliente, por query. Eso resuelve dos problemas
opuestos a la vez: under-fetching (necesito 4 requests) y over-fetching
(me llegan campos que no uso).

## En código: `httpResource` para REST, con mapeo manual

```ts
readonly restQuotes = rxResource({
  params: () => this.customerId(),
  stream: ({ params }) => this.restApi.fetchByCustomer(params).pipe(
    map(quotes => quotes.map(({ id, product, monthlyPremium, coverageAmount }) => ({
      id, product, monthlyPremium, coverageAmount,
    }))),
  ),
});
```

Ese `.map()` recortando campos ES el costo de REST cuando el backend
devuelve de más: el cliente tiene que hacer el trabajo de "recortar" que en
GraphQL ya viene resuelto por el propio query.

## Cuándo elegir cada uno (respuesta de entrevista, no dogma)

- **REST**: APIs públicas/simples, equipos que ya lo dominan, caching HTTP
  estándar (GraphQL sobre POST no cachea igual de fácil a nivel HTTP).
- **GraphQL**: pantallas compuestas con muchas entidades relacionadas,
  apps móviles con ancho de banda limitado (menos over-fetching importa
  más), equipos con backend BFF (Backend For Frontend) dedicado.

## Práctica

`app/src/app/features/lab/graphql-quotes/` — mismo dato, dos formas de
pedirlo, lado a lado.
