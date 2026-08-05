import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IncidentsStore } from './incidents-store';

@Component({
  selector: 'app-incidents-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './incidents-list.component.html',
})
export class IncidentsList {
  protected readonly store = inject(IncidentsStore);
}
