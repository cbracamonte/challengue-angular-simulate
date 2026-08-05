import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';

/**
 * Versión legacy (Angular 14-18): usa @ViewChild/@ViewChildren, pero los
 * lee en ngOnInit() — ANTES de que la vista termine de inicializarse. Acá
 * `searchInput` todavía es `undefined` y `policyRows` está vacío.
 *
 * No editar: es la referencia de "lo que hay en producción", con el bug
 * real incluido (explota apenas se crea el componente).
 */
@Component({
  selector: 'app-recent-policies-legacy',
  template: `
    <input #searchInput type="text" placeholder="Buscar póliza..." />
    <ul>
      @for (policy of policies; track policy.id) {
        <li #policyRow>{{ policy.holderName }}</li>
      }
    </ul>
    <p>Filas encontradas: {{ rowCount }}</p>
  `,
})
export class RecentPoliciesLegacyComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChildren('policyRow') policyRows!: QueryList<ElementRef>;

  readonly policies = [
    { id: 'POL-1', holderName: 'Ana Beatriz Ríos' },
    { id: 'POL-2', holderName: 'Tomás Vera' },
  ];

  rowCount = 0;

  ngOnInit(): void {
    // BUG: la vista todavía no existe acá. @ViewChild/@ViewChildren recién
    // se resuelven después de ngAfterViewInit.
    this.searchInput.nativeElement.focus();
    this.rowCount = this.policyRows.length;
  }
}
