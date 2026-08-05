import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PolicyService } from './policy.service';
import { Policy } from './policy.model';

/**
 * TODO — Refactor Lab · Ejercicio 1
 *
 * Reemplazá la implementación de policy-list-legacy (carpeta ./legacy,
 * NO la edites) por una versión standalone + Signals. Corré:
 *
 *   pnpm test --include='**\/policy-list.component.spec.ts'
 *
 * y hacé pasar los 3 tests en rojo. Detalles y pistas en README.md.
 */
@Component({
  selector: 'app-policy-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './policy-list.component.html',
  styleUrl: './policy-list.component.scss',
})
export class PolicyList {
  private readonly policyService = inject(PolicyService);

  // TODO(1): reemplazá este signal hardcodeado por uno alimentado en vivo
  //          desde policyService.watchPolicies(), sin dejar una subscription
  //          viva cuando el componente se destruye.
  //          Pista: mirá `toSignal` en @angular/core/rxjs-interop.
  protected readonly policies = signal<Policy[]>([]);

  // TODO(2): derivá el total de primas de `policies` con computed().
  protected readonly totalPremium = computed(() => 0);
}
