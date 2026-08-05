import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PolicyIssuanceStore } from './policy-issuance.store';

@Component({
  selector: 'app-policy-issuance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './policy-issuance.component.html',
})
export class PolicyIssuanceComponent {
  protected readonly store = inject(PolicyIssuanceStore);

  submit(): void {
    this.store.submit('POL-DEMO-1');
  }
}
