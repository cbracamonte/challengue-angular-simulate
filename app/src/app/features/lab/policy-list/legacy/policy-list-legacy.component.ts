import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { PolicyService } from '../policy.service';
import { Policy } from '../policy.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * REFERENCIA LEGACY — así se ve el código productivo heredado.
 * No la edites. Tu trabajo es construir el reemplazo moderno en
 * policy-list.component.ts, no parchear esta — igual que en un refactor
 * real, donde el código viejo sigue vivo hasta que el nuevo se despliega.
 */
@Component({
  selector: 'app-policy-list-legacy',
  templateUrl: './policy-list-legacy.component.html',
  // Angular 22 pone standalone: true por defecto en todo @Component. El
  // código legacy real de un codebase Angular 14-18 es anterior a ese
  // default, así que tiene que optar explícitamente para poder declararse
  // dentro del NgModule de abajo.
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PolicyListLegacyComponent implements OnInit {
  policies: Policy[] = [];

  constructor(private policyService: PolicyService, private destroyRef: DestroyRef, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // BUG: watchPolicies() nunca completa (es interval-based) y esta
    // subscription nunca se guarda ni se desuscribe. Cada vez que este
    // componente se crea y se destruye, queda un interval más corriendo
    // para siempre.
    this.policyService.watchPolicies().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((policies) => {
      this.policies = policies;
      this.cdr.markForCheck();
    });
  }

  totalPremium() {
    let total = 0;
    for (let i = 0; i < this.policies.length; i++) {
      total = total + this.policies[i].premium;
    }
    return total;
  }
}
