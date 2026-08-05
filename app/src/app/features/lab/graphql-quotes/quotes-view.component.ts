import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuotesStore } from './quotes-store';

@Component({
  selector: 'app-quotes-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './quotes-view.component.html',
})
export class QuotesView {
  protected readonly store = inject(QuotesStore);
}
