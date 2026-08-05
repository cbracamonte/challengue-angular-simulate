# 11 — Estrategia de refactor legacy y SonarQube

## La pregunta que define si sos senior en esta entrevista

"Heredás un módulo sin tests, con `ChangeDetectionStrategy` default (no
`OnPush`), y te piden reducir deuda técnica sin romper producción. ¿Por
dónde empezás?"

Respuesta de junior: "Reescribo el módulo con Signals y OnPush."
Respuesta de senior: "Primero pruebas de caracterización del comportamiento
ACTUAL, después refactor incremental validado contra esas pruebas en cada
paso."

## Por qué el orden importa

Reescribir sin red de seguridad sobre código que sostiene producción activa
es apostar a que entendiste el 100% del comportamiento actual — incluyendo
los edge cases que nadie documentó y que algún cliente depende de ellos sin
que lo sepas. Un **test de caracterización** no valida que el código esté
"bien" — documenta y congela qué hace HOY, para que cualquier cambio
posterior que rompa ese comportamiento te avise a vos, en CI, antes de
llegar a producción.

```ts
// No es un test de "buen diseño". Es un test de "esto es lo que hace hoy".
it('caracterización: calcula el total sumando primas sin redondear', () => {
  const result = component.totalPremium(); // como está HOY, con su bug de redondeo si lo tiene
  expect(result).toBe(255); // el valor real observado, no el "correcto"
});
```

Con esa red, el refactor (a Signals, a OnPush, a lo que sea) se hace en
pasos chicos, corriendo la suite en cada uno — exactamente el balance que
pide el JD: "sostener el ritmo de resolución de incidentes sin comprometer
la calidad".

## SonarQube: Cognitive Complexity

SonarQube marca "Cognitive Complexity too high" en métodos con mucho
anidamiento (`if` dentro de `if` dentro de `for`...). No es lo mismo que
Cyclomatic Complexity (cuenta caminos de ejecución) — Cognitive Complexity
penaliza específicamente lo difícil que es de LEER un método, con más peso
por cada nivel de anidamiento.

**Lo que reduce el score de verdad:**

```ts
// Antes: anidado
function process(order: Order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.status === 'pending') {
        // lógica real acá, a 3 niveles de profundidad
      }
    }
  }
}

// Después: guard clauses (early return), aplanado
function process(order: Order) {
  if (!order) return;
  if (order.items.length === 0) return;
  if (order.status !== 'pending') return;
  // lógica real acá, a nivel 0
}
```

**Lo que NO reduce el score** (aunque parezca ayudar): agregar comentarios
explicando cada bloque, o renombrar variables. Esas cosas mejoran
legibilidad humana, pero la métrica mide estructura de control de flujo, no
prosa.

## Práctica

`app/src/app/features/lab/policy-list/legacy/policy-list-legacy.component.ts`
tiene un `totalPremium()` con un `for` clásico en vez de `reduce` — no es
un problema de Cognitive Complexity en sí (es simple), pero es el tipo de
código que SonarQube marcaría como "puede expresarse más claro" en una
regla de estilo funcional.
