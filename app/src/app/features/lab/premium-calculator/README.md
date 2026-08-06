# Ejercicio 11 — premium-calculator: Signals en profundidad (linkedSignal, effect, untracked)

## Contexto

`legacy/premium-calculator-legacy.component.ts` es código que "funciona"
pero abusa de `effect()` para mantener un signal derivado en sincro:
`deductible` es un `signal()` plano que se resetea al valor recomendado del
tier dentro de un `effect()`. Bug real: ese mismo `effect()` también lee
`extraCoverage()` (para loguearla) sin envolverla en `untracked()` — así
que cambiar la cobertura extra, un campo que no debería tener nada que ver
con el deducible, también dispara el effect y **pisa el override manual
del usuario**. Probalo en `/lab/premium-calculator/legacy`: escribí un
deducible a medida, tocá "Cobertura extra", mirá cómo el deducible vuelve
solo al valor recomendado.

No edites `legacy/`. Es la referencia de "lo que hay en producción".

## Tu tarea

`premium-calculator.component.ts` ya está resuelto — este ejercicio es
para leerlo y entender **por qué** cada API se usa donde se usa. Corré los
tests para confirmar que queda todo en verde:

```bash
pnpm test --include='**/premium-calculator.component.spec.ts'
```

## Las 5 APIs, una por una

| API | Dónde | Para qué |
|---|---|---|
| `signal()` | `selectedTier`, `extraCoverage` | Estado plano, de lectura y escritura explícitas. |
| `computed()` | `basePremium`, `recommendedDeductible`, `totalPremium` | Derivar valores de solo lectura, memoizados, a partir de otros signals. |
| `linkedSignal()` | `deductible` | Estado que normalmente se **deriva** de otro signal, pero que el usuario puede **pisar a mano** — y que vuelve a sincronizarse solo cuando la fuente cambia. |
| `effect()` | constructor | Sincronizar signals con algo **fuera** del grafo reactivo de Angular (acá, `localStorage`). |
| `untracked()` | dentro del `effect()` | Leer un signal sin que esa lectura cuente como dependencia del effect. |

## El punto central: `linkedSignal()`

`deductible` no puede ser un `computed()` — el usuario tiene que poder
pisarlo (negociar el deducible es parte real de cotizar una póliza), y
`computed()` es de solo lectura. Tampoco puede ser un `signal()` plano
sincronizado a mano con un `effect()` — ese es el anti-patrón de
`legacy/`.

`linkedSignal(() => this.recommendedDeductible())` es ambas cosas a la
vez: un `WritableSignal` (`deductible.set(valor)` funciona) que además
vuelve a ejecutar su `computation` — y descarta cualquier override
manual — cada vez que la señal que lee (`recommendedDeductible`, y
transitivamente `selectedTier`) cambia de valor.

Docs oficiales de Angular (guía "Deriving state with linked signals"):

> Linked signals are writable signals that maintain a reactive connection
> to their source signals. They are designed for creating state that
> normally follows a computation but can be overridden manually when
> needed. When the source signal changes, the linked signal automatically
> re-syncs with its computation.

## `effect()`: para qué sirve (y para qué no)

Docs oficiales de Angular (guía "Effects", sección "Use cases for
effects"):

> Effects are best suited for syncing signal state with imperative,
> non-signal APIs, such as logging, external storage like localStorage, or
> custom DOM behavior. [...] Using effects to propagate state changes can
> lead to infinite circular updates or change detection errors.

`localStorage` vive fuera del grafo reactivo de Angular — por eso el
`effect()` de este ejercicio es el uso correcto, sancionado por la
documentación. Lo que **no** es correcto es usar `effect()` para derivar
o propagar estado *entre signals de Angular* — para eso ya existen
`computed()` y `linkedSignal()`, que además vienen con garantías (pureza,
memoización, dependencias explícitas) que un `effect()` imperativo no
tiene.

## `untracked()`: por qué el `effect()` no se dispara con cada tecla en "Cobertura extra"

El `effect()` de este ejercicio solo debe reaccionar a `selectedTier` y
`deductible` — no a `extraCoverage`. Pero adentro loguea
`extraCoverage()` para debug. Si esa lectura fuera directa, pasaría a ser
una dependencia más del effect (cualquier signal leído en el cuerpo de un
effect se registra como dependencia), y cada cambio de cobertura extra
reescribiría `localStorage` sin necesidad.

`untracked(() => this.extraCoverage())` ejecuta esa lectura en un
contexto no reactivo — el valor se lee igual, pero no cuenta como
dependencia. Es la misma técnica que usa el ejemplo oficial de los docs
para loguear un `userId` sin que un servicio de logging externo (que
puede leer otros signals adentro) infle las dependencias del effect que
lo llama.

## Si te trabás 30+ minutos

Repasá `recent-policies/recent-policies.component.ts` — ya usa `effect()`
en este mismo repo, con el mismo patrón de testing zoneless
(`fixture.whenStable()` en vez de `fakeAsync`/`tick`).
