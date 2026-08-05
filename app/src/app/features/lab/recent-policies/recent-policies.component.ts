import { Component, ElementRef, computed, effect, viewChild, viewChildren } from '@angular/core';

/**
 * Fundamento teórico (docs oficiales de Angular — API `viewChild`/
 * `viewChildren` y guía "Component queries"): a diferencia de
 * `@ViewChild`/`@ViewChildren`, que solo se resuelven después de
 * `ngAfterViewInit` (leerlos antes, como en la versión legacy con
 * `ngOnInit`, da `undefined`/una `QueryList` vacía), las signal queries
 * devuelven un `Signal` que existe desde el constructor: vale `undefined`
 * (o `[]` para `viewChildren`) hasta que la vista se resuelve, y cambia de
 * valor solo — sin que el componente tenga que "saber" en qué lifecycle
 * hook consultarlo.
 *
 * Esto elimina la pregunta de qué hook usar: en vez de acoplarse a
 * `ngAfterViewInit`, un `effect()` se re-ejecuta automáticamente cada vez
 * que alguna signal que lee cambia de valor — acá, apenas `searchInput()`
 * deja de ser `undefined`, sin importar el momento exacto del ciclo de
 * vida en que eso ocurra.
 */
@Component({
  selector: 'app-recent-policies',
  template: `
    <input #searchInput type="text" placeholder="Buscar póliza..." />
    <ul>
      @for (policy of policies; track policy.id) {
        <li #policyRow>{{ policy.holderName }}</li>
      }
    </ul>
    <p>Filas encontradas: {{ rowCount() }}</p>
  `,
})
export class RecentPoliciesComponent {
  readonly policies = [
    { id: 'POL-1', holderName: 'Ana Beatriz Ríos' },
    { id: 'POL-2', holderName: 'Tomás Vera' },
  ];

  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  readonly policyRows = viewChildren<ElementRef>('policyRow');

  readonly rowCount = computed(() => this.policyRows().length);

  constructor() {
    effect(() => {
      const input = this.searchInput();
      if (input) {
        input.nativeElement.focus();
      }
    });
  }
}
