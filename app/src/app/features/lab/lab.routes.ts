import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import * as incidentsEffects from './ngrx-incidents/incidents.effects';
import { incidentsReducer } from './ngrx-incidents/incidents.reducer';
import { IncidentsLegacyEffects } from './ngrx-incidents/legacy/incidents.legacy-effects';
import { incidentsLegacyReducer } from './ngrx-incidents/legacy/incidents.legacy-reducer';

export const LAB_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./lab-home.component').then((m) => m.LabHome),
  },
  {
    path: 'policy-list',
    loadComponent: () => import('./policy-list/policy-list.component').then((m) => m.PolicyList),
  },
  {
    // NgModule legacy: no es standalone, así que se rutea con loadChildren
    // en vez de loadComponent — la forma correcta de convivir con código
    // pre-standalone en un router moderno.
    path: 'policy-list/legacy',
    loadChildren: () =>
      import('./policy-list/legacy/policy-list-legacy.module').then((m) => m.PolicyListLegacyModule),
  },
  {
    path: 'incidents-store',
    loadComponent: () => import('./incidents-store/incidents-list.component').then((m) => m.IncidentsList),
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth-demo.component').then((m) => m.AuthDemo),
  },
  {
    path: 'graphql-quotes',
    loadComponent: () => import('./graphql-quotes/quotes-view.component').then((m) => m.QuotesView),
  },
  {
    path: 'ngrx-incidents',
    loadComponent: () =>
      import('./ngrx-incidents/incidents-list.component').then((m) => m.NgrxIncidentsList),
    providers: [
      provideState({ name: 'incidents', reducer: incidentsReducer }),
      provideEffects(incidentsEffects),
    ],
  },
  {
    // Misma pantalla, store legacy: acá se ven los incidentes duplicados.
    path: 'ngrx-incidents/legacy',
    loadComponent: () =>
      import('./ngrx-incidents/incidents-list.component').then((m) => m.NgrxIncidentsList),
    providers: [
      provideState({ name: 'incidents', reducer: incidentsLegacyReducer }),
      provideEffects(IncidentsLegacyEffects),
    ],
  },
  {
    path: 'policy-search',
    loadComponent: () => import('./policy-search/policy-search.component').then((m) => m.PolicySearchComponent),
  },
  {
    path: 'policy-issuance',
    loadComponent: () =>
      import('./policy-issuance/policy-issuance.component').then((m) => m.PolicyIssuanceComponent),
  },
  {
    path: 'live-counter',
    loadComponent: () => import('./live-counter/live-counter.component').then((m) => m.LiveCounterComponent),
  },
  {
    path: 'live-counter/legacy',
    loadComponent: () =>
      import('./live-counter/legacy/live-counter-legacy.component').then((m) => m.LiveCounterLegacyComponent),
  },
  {
    path: 'recent-policies',
    loadComponent: () =>
      import('./recent-policies/recent-policies.component').then((m) => m.RecentPoliciesComponent),
  },
  {
    path: 'recent-policies/legacy',
    loadComponent: () =>
      import('./recent-policies/legacy/recent-policies-legacy.component').then(
        (m) => m.RecentPoliciesLegacyComponent,
      ),
  },
  {
    path: 'policy-form',
    loadComponent: () => import('./policy-form/policy-form.component').then((m) => m.PolicyFormComponent),
  },
  {
    path: 'policy-form/legacy',
    loadComponent: () =>
      import('./policy-form/legacy/policy-form-legacy.component').then((m) => m.PolicyFormLegacyComponent),
  },
];
