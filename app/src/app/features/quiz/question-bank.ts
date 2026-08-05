export type QuizTopic =
  | 'standalone-signals'
  | 'rxjs-state'
  | 'auth'
  | 'api-integration'
  | 'styling'
  | 'testing'
  | 'git-process'
  | 'legacy-migration';

export interface QuizQuestion {
  id: string;
  topic: QuizTopic;
  prompt: string;
  code?: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  /** Estilo Harvard: por qué la respuesta correcta es correcta Y por qué la opción incorrecta más tentadora está mal. */
  explanation: string;
  difficulty: 'mid' | 'senior';
  timeLimitSeconds: number;
}

export const TOPIC_LABELS: Record<QuizTopic, string> = {
  'standalone-signals': 'Standalone + Signals',
  'rxjs-state': 'RxJS / NgRx / Estado',
  auth: 'Interceptores, Guards, OAuth2/JWT',
  'api-integration': 'REST vs GraphQL',
  styling: 'SASS / Tailwind / Material',
  testing: 'Jasmine, Jest, Cypress, Playwright',
  'git-process': 'Git Flow / Code Review',
  'legacy-migration': 'Migración Legacy → Moderno',
};

export const QUESTION_BANK: QuizQuestion[] = [
  // ── standalone-signals ────────────────────────────────────────────────
  {
    id: 'ss-1',
    topic: 'standalone-signals',
    prompt:
      'Un componente legacy usa `@Input() userId: string` y dispara una llamada HTTP dentro de `ngOnChanges` cada vez que cambia. Al migrarlo a Signals, ¿cuál es el reemplazo correcto?',
    options: [
      { id: 'a', text: 'input.required<string>() combinado con resource() o rxResource() que reaccione al signal' },
      { id: 'b', text: 'Seguir usando ngOnChanges pero envolviendo el valor en signal.set() manualmente' },
      { id: 'c', text: 'Usar @Input() normal y un effect() que llame a fetch() sin cleanup' },
      { id: 'd', text: 'Mover la llamada HTTP al constructor del componente' },
    ],
    correctOptionId: 'a',
    explanation:
      'input.required() crea un signal de solo lectura ligado al input; resource()/rxResource() re-ejecuta automáticamente su loader cada vez que el signal fuente cambia, con loading/error/value ya modelados. La opción (c) es la trampa típica: un effect() que hace fetch sin usar el resultado como señal reactiva no cancela requests en vuelo (race conditions) y mezcla side-effects imperativos con el grafo reactivo — antipatrón que Angular explícitamente desaconseja para lógica async.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'ss-2',
    topic: 'standalone-signals',
    prompt:
      '¿Por qué `computed()` NO debe usarse para disparar un efecto secundario como `console.log` o una llamada HTTP?',
    options: [
      { id: 'a', text: 'Porque computed() es asíncrono por defecto' },
      { id: 'b', text: 'Porque su función debe ser pura: Angular puede evaluarla más de una vez o descartarla, y memoiza el resultado' },
      { id: 'c', text: 'Porque computed() no permite leer otros signals' },
      { id: 'd', text: 'Porque computed() solo se puede usar dentro de un componente, nunca en un servicio' },
    ],
    correctOptionId: 'b',
    explanation:
      'computed() debe ser una función pura y memoizada — Angular decide cuándo re-evaluarla en base a sus dependencias, no garantiza "una ejecución por cambio". Side-effects van en effect(), que sí está diseñado para eso (con su propio manejo de cleanup). Confundir ambos es la causa #1 de bugs sutiles al migrar de RxJS (donde tap() mezclaba side-effects libremente) a Signals.',
    difficulty: 'senior',
    timeLimitSeconds: 50,
  },
  {
    id: 'ss-3',
    topic: 'standalone-signals',
    prompt:
      'Un componente standalone necesita un servicio que solo existe en el contexto de esa ruta (no debe ser singleton global). ¿Dónde se provee?',
    options: [
      { id: 'a', text: 'En el array `providers` de la ruta (Route.providers) o del componente (@Component.providers)' },
      { id: 'b', text: 'Con providedIn: "root" en el @Injectable' },
      { id: 'c', text: 'Registrándolo en app.config.ts junto a provideRouter' },
      { id: 'd', text: 'No es posible, todo servicio standalone debe ser singleton' },
    ],
    correctOptionId: 'a',
    explanation:
      'providedIn: "root" crea un singleton para toda la app — exactamente lo que NO queremos aquí. `Route.providers` (o `@Component.providers`) crea una instancia nueva por cada activación de esa rama del árbol de inyección, ideal para estado con scope de feature/página. Esto reemplaza al patrón legacy de "un NgModule por feature con su propio providers array".',
    difficulty: 'senior',
    timeLimitSeconds: 45,
  },
  {
    id: 'ss-4',
    topic: 'standalone-signals',
    prompt: '¿Qué reemplaza a `*ngIf` y `*ngFor` en los templates modernos de Angular?',
    options: [
      { id: 'a', text: '@if / @for, control flow nativo del compilador (sin necesidad de importar CommonModule)' },
      { id: 'b', text: 'v-if / v-for' },
      { id: 'c', text: 'Siguen siendo *ngIf/*ngFor, no hay reemplazo' },
      { id: 'd', text: '<Show> y <For> como en SolidJS' },
    ],
    correctOptionId: 'a',
    explanation:
      '@if/@for/@switch son sintaxis nativa del compilador de Angular (no directivas), más rápida en runtime, con mejor type-narrowing en el template, y @for exige `track` explícito — a diferencia de *ngFor donde olvidar trackBy era un error silencioso que degradaba performance en listas grandes.',
    difficulty: 'mid',
    timeLimitSeconds: 30,
  },

  // ── rxjs-state ───────────────────────────────────────────────────────
  {
    id: 'rx-1',
    topic: 'rxjs-state',
    prompt:
      'Un servicio legacy hace `this.http.get(url).subscribe(data => this.items = data)` dentro de `ngOnInit` sin guardar la subscription. ¿Cuál es el riesgo real y cuál el fix idiomático moderno?',
    code: `ngOnInit() {\n  this.http.get<Item[]>(this.url).subscribe(data => this.items = data);\n}`,
    options: [
      { id: 'a', text: 'No hay riesgo: HttpClient completa el Observable solo, así que no hace falta desuscribirse' },
      { id: 'b', text: 'Riesgo de memory leak si el request tarda y el componente se destruye antes; fix: usar async pipe o takeUntilDestroyed()' },
      { id: 'c', text: 'El riesgo es que `items` nunca se actualiza' },
      { id: 'd', text: 'Hay que envolverlo en un setTimeout para evitar el leak' },
    ],
    correctOptionId: 'b',
    explanation:
      'HttpClient SÍ completa tras el primer valor, así que aquí específicamente no hay leak de subscription activa — pero sigue habiendo un riesgo real: si el componente se destruye antes de que resuelva el request, `this.items = data` se ejecuta sobre un componente ya destruido (error en consola, o peor, side-effects sobre estado zombie). El patrón correcto sigue siendo async pipe (deja que Angular gestione el ciclo de vida) o `takeUntilDestroyed()` — es la trampa preferida en entrevistas: casi todos responden "memory leak de subscription" sin notar que HttpClient completa solo.',
    difficulty: 'senior',
    timeLimitSeconds: 75,
  },
  {
    id: 'rx-2',
    topic: 'rxjs-state',
    prompt: '¿Cuál es la diferencia clave entre `switchMap` y `mergeMap` al encadenar un request HTTP disparado por un input de búsqueda?',
    options: [
      { id: 'a', text: 'switchMap cancela el request anterior si llega un nuevo valor antes de que resuelva; mergeMap deja correr todos en paralelo' },
      { id: 'b', text: 'mergeMap es más rápido porque usa menos memoria' },
      { id: 'c', text: 'No hay diferencia funcional, solo de naming' },
      { id: 'd', text: 'switchMap solo funciona con Promises, mergeMap con Observables' },
    ],
    correctOptionId: 'a',
    explanation:
      'switchMap es el operador correcto para "typeahead search": cancela el inner Observable anterior cada vez que llega un nuevo valor, evitando race conditions donde una respuesta vieja y lenta sobreescribe a una más reciente. mergeMap dejaría correr todos los requests en paralelo sin garantía de orden de llegada — bug clásico de búsquedas legacy donde escribís rápido y el resultado "parpadea" a uno viejo.',
    difficulty: 'senior',
    timeLimitSeconds: 50,
  },
  {
    id: 'rx-3',
    topic: 'rxjs-state',
    prompt:
      'En NgRx, un selector se recalcula en cada emisión del Store aunque el slice de estado que le interesa no haya cambiado. ¿Cuál es la causa más probable?',
    options: [
      { id: 'a', text: 'El selector no fue creado con createSelector (no está memoizado) o el objeto retornado se crea nuevo en cada llamada (rompe la comparación por referencia)' },
      { id: 'b', text: 'NgRx no soporta memoización, hay que memoizar manualmente con RxJS distinctUntilChanged siempre' },
      { id: 'c', text: 'Los selectores en NgRx nunca se memoizan' },
      { id: 'd', text: 'El problema es de Angular change detection, no de NgRx' },
    ],
    correctOptionId: 'a',
    explanation:
      'createSelector memoiza por referencia de los inputs, no por deep-equality del output. Un anti-patrón común es hacer `createSelector(selectItems, items => items.map(...))` sin memoizar el `.map()` resultante — cada emisión del store dispara una nueva referencia de array aunque el contenido sea idéntico, invalidando cualquier OnPush/distinctUntilChanged downstream. Este es exactamente el tipo de "deuda técnica" que un JD de refactor legacy espera que sepas diagnosticar.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'rx-4',
    topic: 'rxjs-state',
    prompt: 'El JD dice "NgRx o Signals" para manejo de estado. ¿Cuándo tiene sentido NO migrar un store NgRx existente a Signals durante un refactor?',
    options: [
      { id: 'a', text: 'Cuando el store maneja estado complejo compartido entre muchos módulos con time-travel debugging, efectos side-effect intensivos y el equipo ya lo domina — el costo de migrar supera el beneficio inmediato' },
      { id: 'b', text: 'Nunca: Signals siempre debe reemplazar NgRx apenas sea posible' },
      { id: 'c', text: 'Solo si el proyecto usa Angular menor a v14' },
      { id: 'd', text: 'NgRx y Signals son incompatibles, hay que elegir uno para toda la app' },
    ],
    correctOptionId: 'a',
    explanation:
      'Un refactor senior no es "reescribir todo a lo nuevo" — es juicio técnico sobre costo/beneficio. NgRx sigue siendo la herramienta correcta para estado complejo, compartido, con necesidad de debugging temporal y efectos coordinados. Signals brilla en estado local/de componente y deriva reactiva simple. De hecho son interoperables: `toSignal()` y `toObservable()` permiten combinarlos sin migración total. Responder "reescribir todo" en una entrevista es señal de junior, no de senior.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },

  // ── auth ─────────────────────────────────────────────────────────────
  {
    id: 'auth-1',
    topic: 'auth',
    prompt: 'En Angular moderno, ¿cómo se implementa un interceptor HTTP funcional que agregue el Bearer token?',
    code: `export const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const token = inject(TokenStore).accessToken();\n  return next(token ? req.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } }) : req);\n};`,
    options: [
      { id: 'a', text: 'Es correcto: HttpInterceptorFn es una función pura que puede usar inject() en su cuerpo, registrada con provideHttpClient(withInterceptors([...]))' },
      { id: 'b', text: 'Es incorrecto: los interceptores solo pueden ser clases que implementan HttpInterceptor' },
      { id: 'c', text: 'Es incorrecto: inject() no puede usarse fuera de un constructor' },
      { id: 'd', text: 'Falta llamar a next.handle() en vez de next()' },
    ],
    correctOptionId: 'a',
    explanation:
      'Desde Angular 15+, los interceptores funcionales (HttpInterceptorFn) son la forma recomendada: inject() funciona en su "contexto de inyección" al momento de registrarse vía provideHttpClient(withInterceptors([...])), no requiere una clase. Los interceptores de clase (HttpInterceptor + next.handle()) siguen funcionando (compatibilidad legacy) pero son el patrón que un refactor moderno debería reemplazar.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'auth-2',
    topic: 'auth',
    prompt: 'Un guard legacy usa una clase `CanActivate` que inyecta AuthService por constructor. ¿Cuál es el equivalente funcional moderno?',
    options: [
      { id: 'a', text: 'export const authGuard: CanActivateFn = () => inject(AuthService).isAuthenticated() || inject(Router).createUrlTree(["/login"]);' },
      { id: 'b', text: 'Los guards funcionales no soportan inyección de dependencias' },
      { id: 'c', text: 'Hay que seguir usando clases; Angular no tiene guards funcionales' },
      { id: 'd', text: 'export const authGuard = () => AuthService.isAuthenticated();' },
    ],
    correctOptionId: 'a',
    explanation:
      'CanActivateFn es un tipo función que corre en contexto de inyección (inject() disponible). Retornar un UrlTree (via Router.createUrlTree) en vez de simplemente `false` es la forma correcta de redirigir: `false` bloquea la navegación sin explicar a dónde ir, mientras que un UrlTree le dice al Router exactamente adónde redirigir en la misma operación de navegación (evita un segundo ciclo de navegación).',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'auth-3',
    topic: 'auth',
    prompt: 'Un interceptor de refresh token que reintenta requests tras un 401 entra en loop infinito en producción. ¿Cuál es la causa típica?',
    options: [
      { id: 'a', text: 'El request al endpoint de refresh también pasa por el mismo interceptor, y si el refresh token también expiró, dispara otro refresh — hay que excluir la ruta de refresh del interceptor' },
      { id: 'b', text: 'Los interceptores no pueden hacer requests HTTP adicionales' },
      { id: 'c', text: 'catchError no funciona con HttpClient' },
      { id: 'd', text: 'El navegador bloquea más de 2 requests concurrentes' },
    ],
    correctOptionId: 'a',
    explanation:
      'Bug clásico de producción: si el interceptor no excluye explícitamente la URL de `/auth/refresh`, un 401 en el propio refresh dispara el mismo flujo de "reintentar con refresh" recursivamente. El fix es doble: (1) excluir la ruta de refresh del interceptor, y (2) usar un flag/Subject compartido para evitar disparar múltiples refreshes en paralelo cuando varios requests fallan a la vez (thundering herd).',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },

  // ── api-integration ──────────────────────────────────────────────────
  {
    id: 'api-1',
    topic: 'api-integration',
    prompt: '¿Cuál es la ventaja real de GraphQL sobre REST para una pantalla de "resumen de póliza" que necesita datos de 4 entidades relacionadas?',
    options: [
      { id: 'a', text: 'Un solo request puede pedir exactamente los campos de las 4 entidades relacionadas, evitando over-fetching y el problema N+1 requests de encadenar varios GET' },
      { id: 'b', text: 'GraphQL siempre es más rápido que REST en cualquier escenario' },
      { id: 'c', text: 'GraphQL no necesita autenticación' },
      { id: 'd', text: 'REST no puede devolver datos anidados, GraphQL sí' },
    ],
    correctOptionId: 'a',
    explanation:
      'La ventaja concreta no es "velocidad mágica" sino resolver el problema de under/over-fetching: en REST, una vista compuesta a menudo dispara N requests encadenados (o el backend devuelve de más "por si acaso"). GraphQL deja que el cliente declare exactamente qué campos de qué entidades necesita en un solo roundtrip. REST perfectamente puede anidar JSON (opción d es falsa) — la diferencia es quién decide la forma de la respuesta: el backend (REST) o el cliente (GraphQL).',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'api-2',
    topic: 'api-integration',
    prompt: '¿Qué hace `httpResource()` que `HttpClient.get().subscribe()` no resuelve de forma nativa?',
    options: [
      { id: 'a', text: 'Expone signals de loading/error/value ya sincronizados con el ciclo de vida del componente y se re-ejecuta automáticamente cuando cambian sus parámetros reactivos' },
      { id: 'b', text: 'httpResource() es más rápido a nivel de red' },
      { id: 'c', text: 'HttpClient ya no existe en Angular 22, fue reemplazado' },
      { id: 'd', text: 'httpResource() no soporta autenticación' },
    ],
    correctOptionId: 'a',
    explanation:
      'httpResource() (y resource()/rxResource() en general) modelan el ciclo completo de un fetch async como signals: `.value()`, `.isLoading()`, `.error()`, `.reload()` — sin que vos manejes manualmente subscribe/unsubscribe, banderas de loading booleanas, o carreras entre requests. HttpClient sigue existiendo y siendo la base por debajo; resource es una capa de ergonomía reactiva sobre él, no un reemplazo.',
    difficulty: 'senior',
    timeLimitSeconds: 50,
  },

  // ── styling ──────────────────────────────────────────────────────────
  {
    id: 'style-1',
    topic: 'styling',
    prompt: '¿Por qué Tailwind CSS v4 recomienda NO mezclar su directiva `@import "tailwindcss"` dentro de un archivo `.scss` procesado por Sass?',
    options: [
      { id: 'a', text: 'Porque Sass intenta resolver ese @import como un partial de Sass (buscando un archivo), no lo deja pasar a PostCSS — hay que aislarlo en un .css plano importado aparte' },
      { id: 'b', text: 'Porque Tailwind v4 no es compatible con Angular' },
      { id: 'c', text: 'Porque Sass y PostCSS no pueden coexistir en el mismo proyecto' },
      { id: 'd', text: 'No hay ningún problema real, es solo una preferencia de estilo' },
    ],
    correctOptionId: 'a',
    explanation:
      'Sass procesa `@import "algo";` como su propia sintaxis de import de partials ANTES de que el archivo llegue a PostCSS — y "tailwindcss" no es un partial Sass válido, así que falla. La solución (aplicada en este mismo proyecto) es tener un `tailwind.css` plano con el import, y registrarlo como stylesheet global separado (angular.json → styles[]) en vez de importarlo desde el .scss.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'style-2',
    topic: 'styling',
    prompt: '¿Cuál es el criterio correcto para elegir entre Angular Material, Tailwind y SCSS puro dentro del mismo proyecto (no es "elegir uno solo")?',
    options: [
      { id: 'a', text: 'Material para componentes complejos con accesibilidad ya resuelta (date pickers, tablas); Tailwind para layout/spacing/utilidades rápidas; SCSS para tokens de diseño, mixins y estilos muy específicos de marca' },
      { id: 'b', text: 'Siempre hay que elegir una sola librería de estilos por proyecto, mezclarlas es mala práctica' },
      { id: 'c', text: 'Tailwind reemplaza completamente a Angular Material' },
      { id: 'd', text: 'SCSS ya no se usa en proyectos modernos con Signals' },
    ],
    correctOptionId: 'a',
    explanation:
      'Convivir varias herramientas de estilos es normal en apps enterprise reales (como este mismo proyecto: Material para el toolbar/cards con accesibilidad out-of-the-box, Tailwind para spacing/layout ágil, SCSS para el theming de Material vía @use). Lo que sí es mala práctica es no tener un criterio — mezclar sin reglas lleva a especificidad CSS impredecible.',
    difficulty: 'mid',
    timeLimitSeconds: 45,
  },

  // ── testing ──────────────────────────────────────────────────────────
  {
    id: 'test-1',
    topic: 'testing',
    prompt: '¿Cuál es la diferencia arquitectónica clave entre Jasmine/Karma y Jest para testear Angular?',
    options: [
      { id: 'a', text: 'Karma ejecuta los tests en un navegador real (o headless), útil para detectar bugs específicos de DOM/browser; Jest corre en Node con jsdom, mucho más rápido pero simula el DOM en vez de usar uno real' },
      { id: 'b', text: 'Jest no puede testear componentes Angular, solo funciones puras' },
      { id: 'c', text: 'Karma es más rápido que Jest porque no abre un navegador' },
      { id: 'd', text: 'No hay diferencia real, son intercambiables sin ningún ajuste' },
    ],
    correctOptionId: 'a',
    explanation:
      'La velocidad de Jest (Node + jsdom, sin levantar navegador, ejecución paralela por proceso) es su gran ventaja para feedback loop rápido — pero jsdom no es un navegador real, así que ciertos bugs de rendering/CSS/eventos de browser específicos no se detectan igual. Karma+Jasmine sigue siendo válido cuando el JD lo pide explícitamente (como en este caso) porque corre en Chrome real.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'test-2',
    topic: 'testing',
    prompt: 'Un test unitario con TestBed falla de forma intermitente con "Expected one matching request" al testear un componente que usa `httpResource()`. ¿Cuál es la causa más probable?',
    options: [
      { id: 'a', text: 'El test no esperó a que el resource resuelva (falta await fixture.whenStable() o flushear el HttpTestingController) antes de aserción' },
      { id: 'b', text: 'httpResource() no se puede testear con HttpTestingController' },
      { id: 'c', text: 'Hay que usar Jest en vez de Jasmine para testear resources' },
      { id: 'd', text: 'El componente tiene un bug de memoria' },
    ],
    correctOptionId: 'a',
    explanation:
      'resource()/httpResource() son inherentemente asíncronos: el signal `.value()` no tiene el dato hasta que el microtask/petición resuelve. Un test que hace la aserción inmediatamente después de `createComponent()` sin `await fixture.whenStable()` (o sin flushear el HttpTestingController correspondiente) corre en una carrera contra el resource — a veces "gana" el test (falso positivo) y a veces no (falla intermitente). Exactamente el tipo de flakiness que hay que saber diagnosticar en code review.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },
  {
    id: 'test-3',
    topic: 'testing',
    prompt: '¿Cuál es la diferencia principal entre Cypress y Playwright que afecta la elección para E2E en un proyecto multi-navegador?',
    options: [
      { id: 'a', text: 'Playwright soporta múltiples navegadores (Chromium, Firefox, WebKit) con una única API y ejecución real multi-proceso/multi-tab; Cypress tradicionalmente corre dentro de un solo navegador con arquitectura basada en el mismo proceso que la app' },
      { id: 'b', text: 'Cypress no puede hacer aserciones asíncronas' },
      { id: 'c', text: 'Playwright solo funciona con React, no con Angular' },
      { id: 'd', text: 'No hay ninguna diferencia técnica relevante entre ambos' },
    ],
    correctOptionId: 'a',
    explanation:
      'Playwright fue diseñado desde cero para multi-browser y multi-tab/multi-contexto (útil para simular, por ejemplo, un flujo de OAuth que abre una ventana nueva). Cypress históricamente tuvo limitaciones ahí por correr dentro del mismo run-loop del navegador que la app testeada (aunque su soporte cross-browser mejoró con el tiempo). Ambos son válidos para el JD ("Cypress o Playwright") — lo que importa en la entrevista es que sepas justificar la elección con criterios técnicos, no solo preferencia.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },

  // ── git-process ──────────────────────────────────────────────────────
  {
    id: 'git-1',
    topic: 'git-process',
    prompt: 'En Git Flow, ¿desde qué rama se crea una `feature/*` y hacia dónde se mergea al finalizar?',
    options: [
      { id: 'a', text: 'Se crea desde develop y se mergea de vuelta a develop (nunca directo a main/master)' },
      { id: 'b', text: 'Se crea desde main y se mergea a main directamente' },
      { id: 'c', text: 'Se crea desde la última release tag' },
      { id: 'd', text: 'Git Flow no distingue entre develop y main' },
    ],
    correctOptionId: 'a',
    explanation:
      'Git Flow separa main (siempre desplegable/production-ready) de develop (integración continua de features). Las feature branches viven cortas, salen de develop y vuelven a develop; solo release/* y hotfix/* tocan main. Confundir esto en una entrevista es señal de no haber trabajado con el modelo completo, solo con GitHub Flow simplificado.',
    difficulty: 'mid',
    timeLimitSeconds: 40,
  },
  {
    id: 'git-2',
    topic: 'git-process',
    prompt: 'Como senior mentor, encontrás en un PR de un dev Mid un cambio funcionalmente correcto pero con una `any` innecesaria y sin tests. ¿Cuál es el comentario de code review más efectivo?',
    options: [
      { id: 'a', text: 'Explicar el riesgo concreto de esa `any` (qué bug futuro habilita) y pedir el tipo correcto + un test que cubra el caso, con un ejemplo breve — no solo "cambiá esto"' },
      { id: 'b', text: 'Aprobar el PR igual, total funciona' },
      { id: 'c', text: 'Rechazar el PR sin comentarios y reescribirlo vos mismo' },
      { id: 'd', text: 'Pedir que se agregue un comentario // TODO: fix typing y aprobar' },
    ],
    correctOptionId: 'a',
    explanation:
      'El JD pide explícitamente "mentoría" y "code reviews constructivos" — la habilidad evaluada no es detectar el problema (eso lo hace un linter), sino comunicar el PORQUÉ de forma que el dev Mid aprenda el principio y lo aplique solo la próxima vez. "Cambiá esto" sin contexto no forma equipo; aprobar con TODO pendiente acumula la misma deuda técnica que el JD dice que hay que reducir.',
    difficulty: 'senior',
    timeLimitSeconds: 60,
  },

  // ── legacy-migration ─────────────────────────────────────────────────
  {
    id: 'legacy-1',
    topic: 'legacy-migration',
    prompt:
      'Heredás un módulo Angular 15 con NgModules, componentes con `changeDetection` por defecto (Default, no OnPush) y sin tests. El JD pide reducir deuda técnica sin comprometer la estabilidad en producción. ¿Cuál es el orden correcto de intervención?',
    options: [
      {
        id: 'a',
        text: 'Primero cobertura de tests de caracterización sobre el comportamiento actual, luego refactor incremental (OnPush, standalone, signals) módulo por módulo, validando con esos tests en cada paso',
      },
      { id: 'b', text: 'Reescribir todo el módulo desde cero en standalone + signals de una sola vez' },
      { id: 'c', text: 'Cambiar todo a OnPush primero sin tests, y arreglar los bugs que aparezcan en producción' },
      { id: 'd', text: 'Ignorar el módulo hasta que rompa, no vale la pena refactorizar código que funciona' },
    ],
    correctOptionId: 'a',
    explanation:
      'Esto es literalmente el corazón del rol descrito en el JD: "sostener el ritmo de resolución de incidentes sin comprometer la calidad". Refactorizar sin red de seguridad (tests) sobre código en producción activa es el error #1 que un entrevistador senior va a sondear. El patrón correcto — tests de caracterización primero, refactor incremental después, validado en cada paso — es lo que separa "sé escribir Signals" de "sé liderar un refactor legacy real".',
    difficulty: 'senior',
    timeLimitSeconds: 75,
  },
  {
    id: 'legacy-2',
    topic: 'legacy-migration',
    prompt: 'SonarQube marca "Cognitive Complexity too high" en un método de 80 líneas con 6 niveles de anidamiento. ¿Cuál es la refactorización que más reduce ese score sin cambiar comportamiento?',
    options: [
      {
        id: 'a',
        text: 'Extraer early returns (guard clauses) para aplanar el anidamiento, y dividir el método en funciones más pequeñas con nombres que expliquen la intención de cada bloque',
      },
      { id: 'b', text: 'Agregar comentarios explicando cada bloque, sin tocar la estructura' },
      { id: 'c', text: 'Envolver todo el método en un try/catch para simplificarlo' },
      { id: 'd', text: 'Renombrar variables a nombres más cortos' },
    ],
    correctOptionId: 'a',
    explanation:
      'Cognitive Complexity en SonarQube penaliza específicamente el anidamiento y los saltos de control de flujo (if dentro de if dentro de for...). Guard clauses (early return) aplanan la estructura sin cambiar la lógica. Extraer funciones con nombres intencionales reduce la complejidad POR MÉTODO (cada función nueva empieza en 0) y mejora legibilidad — a diferencia de comentarios o renombres, que no tocan la métrica real.',
    difficulty: 'mid',
    timeLimitSeconds: 60,
  },
];
