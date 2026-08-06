import { Component, EventEmitter, Output, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PolicyFormValue } from './policy-form.model';

/**
 * Fundamento teórico (docs oficiales de Angular — guía "Validating form
 * input" en Reactive Forms): en Reactive Forms la clase del componente es
 * la única fuente de verdad de la validación — los validadores se declaran
 * una sola vez en el modelo del `FormGroup`/`FormControl`, y Angular los
 * re-evalúa automáticamente en cada cambio de valor, exponiendo el
 * resultado en `form.valid`/`form.invalid`. Al consultar esa misma
 * propiedad tanto para deshabilitar el botón (`[disabled]="form.invalid"`)
 * como dentro de `submit()`, es estructuralmente imposible que ambos
 * chequeos diverjan: hay un solo lugar donde vive la regla de validez. La
 * versión legacy, en cambio, mantenía la lógica duplicada en dos métodos
 * (`canSubmit()` y `submit()`) que un cambio futuro podía actualizar en uno
 * y olvidar en el otro — exactamente lo que pasó con el bug real.
 */
@Component({
  selector: 'app-policy-form',
  imports: [ReactiveFormsModule],
  // Nota: <a href> plano (no routerLink/RouterLink) a propósito. El spec de
  // este componente crea el fixture sin TestBed.configureTestingModule ni
  // provideRouter(), así que RouterLink (que inyecta ActivatedRoute/Router)
  // haría explotar el test con NG0201 apenas se crea el componente.
  template: `
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <a
        href="/lab"
        class="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M12.79 5.23a.75.75 0 0 1 0 1.06L9.06 10l3.73 3.71a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
            clip-rule="evenodd"
          />
        </svg>
        Refactor Lab
      </a>
      <a
        href="/lab/policy-form/legacy"
        class="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
      >
        Ver versión legacy →
      </a>
    </div>

    <div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800"
      >
        Reactive Forms
      </span>
      <form [formGroup]="form" class="mt-4 flex flex-col gap-3">
        <input
          formControlName="holderName"
          placeholder="Titular"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
        />
        <input
          formControlName="premium"
          type="number"
          placeholder="Prima"
          class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
        />
        <p class="text-sm text-slate-600">
          Vista previa:
          <span class="font-medium text-slate-900">{{ formValue().holderName }} — \${{ formValue().premium }}</span>
        </p>
        <button
          type="button"
          [disabled]="form.invalid"
          (click)="submit()"
          class="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Emitir
        </button>
      </form>
    </div>
  `,
})
export class PolicyFormComponent {
  @Output() issue = new EventEmitter<PolicyFormValue>();

  private readonly fb = inject(FormBuilder);

  // `nonNullable` es lo que le da a los controles el tipo `string`/`number`
  // en vez de `string | null`/`number | null` — así el valor calza con
  // PolicyFormValue.
  readonly form = this.fb.nonNullable.group({
    holderName: ['', Validators.required],
    premium: [0, [Validators.required, Validators.min(1)]],
  });

  readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  submit(): void {
    if (this.form.invalid) return;
    this.issue.emit(this.form.getRawValue());
  }
}
