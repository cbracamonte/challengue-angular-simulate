import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PolicyService } from './policy.service';
import { Policy } from './policy.model';

@Component({
  selector: 'app-policy-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './policy-list.component.html',
  styleUrl: './policy-list.component.scss',
})
export class PolicyList implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly destroyRef = inject(DestroyRef);

  // === Enfoque 1: manual — ngOnInit + subscribe + DestroyRef ===
  // Explícito: vos controlás el ciclo de vida a mano. takeUntilDestroyed()
  // necesita el DestroyRef pasado a mano porque ngOnInit() corre FUERA del
  // contexto de inyección (por eso no alcanza con inject() sin argumento acá).
  protected readonly policiesManual = signal<Policy[]>([]);

  protected readonly totalPremiumManual = computed(() =>
    this.policiesManual().reduce((acc, policy) => acc + policy.premium, 0),
  );

  ngOnInit(): void {
    this.policyService
      .watchPolicies()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((policies) => this.policiesManual.set(policies));
  }

  // === Enfoque 2: rxResource — declarativo ===
  // Sin `params`: el stream se suscribe una sola vez al crearse el resource
  // (watchPolicies() ya es un feed continuo por sí solo, no hay ningún valor
  // reactivo del que "reaccionar"). rxResource se desuscribe solo cuando el
  // componente se destruye — no hace falta DestroyRef manual acá.
  protected readonly policyResource = rxResource({
    stream: () => this.policyService.watchPolicies(),
    defaultValue: [] as Policy[],
  });

  protected readonly totalPremiumResource = computed(() =>
    this.policyResource.value().reduce((acc, policy) => acc + policy.premium, 0),
  );
}
