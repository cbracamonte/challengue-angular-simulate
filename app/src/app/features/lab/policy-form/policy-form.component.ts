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
  template: `
    <form [formGroup]="form">
      <input formControlName="holderName" placeholder="Titular" />
      <input formControlName="premium" type="number" placeholder="Prima" />
      <p>Vista previa: {{ formValue().holderName }} — \${{ formValue().premium }}</p>
      <button type="button" [disabled]="form.invalid" (click)="submit()">Emitir</button>
    </form>
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
