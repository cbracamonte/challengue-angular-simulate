# Simulación técnica — Frontend Developer Senior (GlobalTask)

Workspace de preparación para el proceso de GlobalTask: challenge en
TestGorilla + Live Coding con el cliente. Reproduce el foco real del
puesto — refactor de una plataforma Angular de suscripción/emisión de
pólizas, de legacy (14-18) a moderno (Signals, Standalone), sin romper
RxJS/NgRx existente ni bajar la cobertura de tests.

Ver el detalle del puesto en `assets/job_description.pdf`.

## Cómo está organizado

```
app/                      → workspace Angular 22 (Karma/Jasmine, Playwright, Tailwind + Material + SCSS)
  src/app/features/
    home/                  → mapa: requisito del JD → dónde practicarlo
    quiz/                  → quiz estilo TestGorilla (cronometrado, feedback inmediato)
    lab/                   → 4 ejercicios TDD (legacy → moderno)
    live-coding/           → brief cronometrado + checklist de Git Flow/code review
docs/concepts/             → 11 casos estilo Harvard: patrón malo → error real → causa → fix → patrón bueno
.claude/skills/            → 19 skills de referencia (arquitectura, DDD, TDD, patrones) instaladas para este proyecto
```

## Arrancar

```bash
cd app
pnpm start          # http://localhost:4200
pnpm test           # unit tests (Karma/Jasmine, watch mode)
pnpm test --watch=false --browsers=ChromeHeadless   # una sola corrida (CI-style)
pnpm e2e             # Playwright
pnpm build           # build de producción
```

## Cómo usar esto (orden recomendado)

1. **`docs/concepts/`** — leelos todos una vez, aunque sea rápido. Son
   cortos a propósito: concepto directo, sin relleno.
2. **`/lab`** en la app — resolvé los 4 ejercicios en orden. Cada uno tiene
   tests en rojo que tenés que llevar a verde. No mires la carpeta
   `legacy/` de cada uno como "para copiar" — es la referencia de lo que
   vas a heredar en el trabajo real, no la solución.
3. **`/quiz`** — una vez que resolviste el lab, medite con el quiz
   cronometrado. Si un tema te da <60%, volvé al doc de ese tema antes de
   seguir.
4. **`/live-coding`** — para la instancia de Live Coding con el cliente.
   Practicá pensando en voz alta con el timer corriendo, no en silencio.

## Mapa completo: requisito del JD → dónde está

| Requisito (JD) | Módulo | Doc |
|---|---|---|
| Standalone Components + Signals | `lab/policy-list` | `01`, `04` |
| RxJS avanzado / NgRx o Signals | `lab/incidents-store` | `02`, `03` |
| Interceptores, guards, OAuth2/JWT | `lab/auth` | `05` |
| APIs RESTful y GraphQL | `lab/graphql-quotes` | `06` |
| SASS/LESS, Tailwind, Material, Bootstrap | shell de la app entera | `07` |
| Jasmine/Karma o Jest, Cypress o Playwright | specs de cada ejercicio | `08` |
| Git avanzado (Gitflow, PRs, Code Review) | `live-coding` | `09` |
| Mentoría y comunicación técnico-negocio | `live-coding` | `10` |
| Refactor legacy, deuda técnica, SonarQube | todo el `lab/` | `11` |

## Nota honesta

Esto te prepara con rigor técnico y práctica real — no garantiza el
resultado de la entrevista, eso depende de cómo lo trabajes vos. Lo que sí
te puedo asegurar es que cada concepto acá tiene un caso de error real
detrás, no solo teoría.
