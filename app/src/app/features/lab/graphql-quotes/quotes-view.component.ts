import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { QuotesStore } from './quotes-store';

@Component({
  selector: 'app-quotes-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quotes-view.component.html',
})
export class QuotesView {
  protected readonly store = inject(QuotesStore);
}
