# Ejercicio 9 — recent-policies: @ViewChild/@ViewChildren vs signal queries

## Contexto

`legacy/recent-policies-legacy.component.ts` es código Angular 14-18: usa
`@ViewChild`/`@ViewChildren`, pero los lee dentro de `ngOnInit()`. El
problema real: esas queries recién se resuelven después de
`ngAfterViewInit()` — en `ngOnInit()`, `searchInput` todavía es
`undefined`. Este componente explota apenas se crea:
`TypeError: Cannot read properties of undefined (reading 'nativeElement')`.

No edites `legacy/`. Es la referencia de "lo que hay en producción" — el
bug real de "en qué lifecycle hook leo esto" que casi todo el mundo pisa
alguna vez con decoradores.

## Tu tarea

Completá `recent-policies.component.ts` hasta que pase:

```bash
pnpm test --include='**/recent-policies.component.spec.ts'
```

El test verifica que el input de búsqueda quede enfocado solo, y que
`rowCount()` cuente las filas reales — sin usar ningún lifecycle hook.

## Pista (no la solución)

`viewChild()`/`viewChildren()` son signals: existen desde el constructor
(valen `undefined`/`[]` hasta que la vista resuelve) y podés reaccionar a
cuándo cambian con `effect()`, sin preguntarte "¿esto va en ngOnInit o en
ngAfterViewInit?" — la pregunta deja de existir.

```ts
readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
readonly policyRows = viewChildren<ElementRef>('policyRow');
readonly rowCount = computed(() => this.policyRows().length);

constructor() {
  effect(() => {
    const input = this.searchInput();
    if (input) input.nativeElement.focus();
  });
}
```

## Si te trabás 30+ minutos

`docs/concepts/01-standalone-signals-migration.md` tiene el mismo eje
(por qué las signal APIs no dependen de lifecycle hooks) aplicado a otro
caso.
