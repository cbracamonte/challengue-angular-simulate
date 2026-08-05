import { Routes } from '@angular/router';

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
];
