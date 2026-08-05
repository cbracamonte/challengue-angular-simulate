import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IncidentsStore } from './incidents-store';

@Component({
  selector: 'app-incidents-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './incidents-list.component.html',
})
export class IncidentsList {
  protected readonly store = inject(IncidentsStore);
}
