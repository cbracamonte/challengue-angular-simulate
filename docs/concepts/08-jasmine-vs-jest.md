# 08 — Testing: Jasmine/Karma vs Jest, Cypress vs Playwright

## Unit testing: Karma+Jasmine vs Jest

| | Karma + Jasmine | Jest |
|---|---|---|
| Dónde corre | Navegador real (o headless) | Node.js + jsdom (DOM simulado) |
| Velocidad | Más lento (levanta navegador) | Más rápido (sin navegador, paralelo por proceso) |
| Fidelidad de DOM/CSS | Alta (browser real) | Media (jsdom no es un browser completo) |
| Config con Angular CLI | Nativa desde siempre | `ng new --test-runner=jest`, o `jest-preset-angular` |

Este proyecto usa Karma+Jasmine a propósito (`ng new --test-runner=karma`)
porque el JD lo pide explícitamente. Angular 22 cambió el default de
`ng new` a **Vitest** (no Jest) — otro test runner basado en Node, más
rápido que Karma, pero distinto de lo que pide este JD. Si te preguntan
"¿por qué no usaron el default del CLI?", esa es la respuesta: el default
cambió recientemente, y el JD pide específicamente Jasmine/Karma o Jest.

## Un bug real de testing con `resource()`

```ts
it('carga la póliza', () => {
  const fixture = TestBed.createComponent(PolicyDetail);
  fixture.detectChanges();
  expect(fixture.componentInstance.policy.value()).toEqual(mockPolicy); // ❌ falla a veces
});
```

`resource()`/`rxResource()`/`httpResource()` son asíncronos: el signal
`.value()` no tiene el dato hasta que el loader resuelve. Sin esperar, el
test corre en carrera contra el resource — a veces "gana" (pasa) y a veces
no (falla intermitente, "flaky"). El fix:

```ts
it('carga la póliza', async () => {
  const fixture = TestBed.createComponent(PolicyDetail);
  fixture.detectChanges();
  await fixture.whenStable(); // o: await TestBed.inject(ApplicationRef).whenStable();
  expect(fixture.componentInstance.policy.value()).toEqual(mockPolicy);
});
```

Reconocer un test flaky por falta de `await` — en vez de asumir "el código
tiene un bug" — es una habilidad de debugging que un entrevistador
senior valora mucho.

## E2E: Cypress vs Playwright

| | Cypress | Playwright |
|---|---|---|
| Navegadores | Chromium, Firefox, WebKit (soporte cross-browser mejoró con el tiempo) | Chromium, Firefox, WebKit — diseñado multi-browser desde el día 1 |
| Multi-tab / multi-contexto | Históricamente limitado | Nativo (útil para flujos OAuth que abren ventana nueva) |
| Arquitectura | Corre dentro del navegador, mismo run-loop que la app | Controla el navegador vía protocolo, procesos separados |
| Integración Angular CLI | Vía `@cypress/schematic` | Soporte de primera clase reciente en `ng e2e` |

Este proyecto usa Playwright. Ambos son válidos para el JD ("Cypress o
Playwright") — lo que un entrevistador evalúa es que puedas JUSTIFICAR la
elección con criterios técnicos (multi-tab, velocidad, ecosistema del
equipo), no solo "es el que usé antes".

## Práctica

Cada ejercicio de `app/src/app/features/lab/` tiene su spec en Jasmine —
correlos y leé por qué fallan antes de mirar la pista.
