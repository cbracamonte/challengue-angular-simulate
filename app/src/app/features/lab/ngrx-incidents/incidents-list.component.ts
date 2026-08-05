import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { IncidentsActions } from './actions';
import { selectAllIncidents, selectIncidentsLoading } from './selectors';

@Component({
  selector: 'app-ngrx-incidents-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './incidents-list.component.html',
})
export class NgrxIncidentsList implements OnInit {
  private readonly store = inject(Store);

  protected readonly incidents = this.store.selectSignal(selectAllIncidents);
  protected readonly loading = this.store.selectSignal(selectIncidentsLoading);

  ngOnInit(): void {
    this.store.dispatch(IncidentsActions.loadIncidents());
    // Despachado dos veces a propósito: con el reducer legacy vas a ver
    // incidentes duplicados en la lista. Con el corregido, no.
    this.store.dispatch(IncidentsActions.loadIncidents());
  }
}
