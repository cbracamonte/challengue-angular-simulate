import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PolicySearchStore } from './policy-search.store';

@Component({
  selector: 'app-policy-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './policy-search.component.html',
})
export class PolicySearchComponent {
  protected readonly store = inject(PolicySearchStore);

  onSearch(term: string): void {
    this.store.search(term);
  }
}
