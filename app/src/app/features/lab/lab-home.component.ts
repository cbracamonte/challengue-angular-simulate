import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

interface LabExercise {
  slug: string;
  title: string;
  summary: string;
  jdRequirement: string;
  available: boolean;
  /** Ruta del código legacy de referencia, relativa a app/src/app/features/lab/. */
  legacyPath: string;
  /** Si el legacy tiene una vista rutable propia, el link va acá. Si no, se muestra solo el path. */
  legacyRoute?: string;
}

@Component({
  selector: 'app-lab-home',
  imports: [RouterLink, MatCardModule],
  templateUrl: './lab-home.component.html',
  styleUrl: './lab-home.component.scss',
})
export class LabHome {
  protected readonly exercises: LabExercise[] = [
    {
      slug: 'policy-list',
      title: '1 · policy-list',
      summary: 'NgModule legacy con leak real → standalone + signals (toSignal, computed, OnPush).',
      jdRequirement: 'Standalone Components y Signals donde aplique',
      available: true,
      legacyPath: 'policy-list/legacy/policy-list-legacy.component.ts',
      legacyRoute: 'policy-list/legacy',
    },
    {
      slug: 'incidents-store',
      title: '2 · incidents-store',
      summary: 'RxJS con nested subscribes y sin cleanup → composición limpia con takeUntilDestroyed.',
      jdRequirement: 'RxJS avanzado, NgRx o Signals',
      available: true,
      legacyPath: 'incidents-store/legacy/incidents.legacy.service.ts',
    },
    {
      slug: 'auth',
      title: '3 · auth',
      summary: 'Interceptor + guard funcionales para OAuth2/JWT, con refresh token sin loops infinitos.',
      jdRequirement: 'Interceptores, guards, OAuth2/JWT',
      available: true,
      legacyPath: 'auth/legacy/auth.legacy-interceptor.ts + auth.legacy-guard.ts',
    },
    {
      slug: 'graphql-quotes',
      title: '4 · graphql-quotes',
      summary: 'REST vs GraphQL con httpResource/rxResource, loading/error como signals.',
      jdRequirement: 'APIs RESTful y GraphQL',
      available: true,
      legacyPath: 'graphql-quotes/quotes-rest.api.ts (no es legacy, es la comparación REST)',
    },
    {
      slug: 'ngrx-incidents',
      title: '5 · ngrx-incidents',
      summary: 'Store NgRx completo: reducer que muta + effect con subscribe anidado → reducer puro + effect funcional con switchMap.',
      jdRequirement: 'NgRx o Signals para manejo de estado',
      available: true,
      legacyPath: 'ngrx-incidents/legacy/incidents.legacy-reducer.ts + incidents.legacy-effects.ts',
      legacyRoute: 'ngrx-incidents/legacy',
    },
    {
      slug: 'policy-search',
      title: '6 · policy-search',
      summary: 'Condición de carrera real en un typeahead: mergeMap deja pisar resultados con datos obsoletos → switchMap.',
      jdRequirement: 'RxJS avanzado',
      available: true,
      legacyPath: 'policy-search/legacy/policy-search-legacy.service.ts',
    },
    {
      slug: 'policy-issuance',
      title: '7 · policy-issuance',
      summary: 'Retry sin backoff (bombardea un backend caído) → retry() con backoff exponencial real.',
      jdRequirement: 'RxJS avanzado',
      available: true,
      legacyPath: 'policy-issuance/legacy/policy-issuance-legacy.service.ts',
    },
    {
      slug: 'live-counter',
      title: '8 · live-counter',
      summary: 'El bug que zone.js tapaba: campo plano + setInterval no actualiza nada en una app zoneless → signal().',
      jdRequirement: 'Angular moderno (Signals, zoneless)',
      available: true,
      legacyPath: 'live-counter/legacy/live-counter-legacy.component.ts',
      legacyRoute: 'live-counter/legacy',
    },
    {
      slug: 'recent-policies',
      title: '9 · recent-policies',
      summary: '@ViewChild leído en ngOnInit (undefined, explota) → viewChild()/viewChildren() + effect().',
      jdRequirement: 'Angular moderno (Signals)',
      available: true,
      legacyPath: 'recent-policies/legacy/recent-policies-legacy.component.ts',
      legacyRoute: 'recent-policies/legacy',
    },
    {
      slug: 'policy-form',
      title: '10 · policy-form',
      summary: 'Validación manual duplicada y desincronizada → Reactive Forms con una sola fuente de verdad (form.valid).',
      jdRequirement: 'Formularios reactivos',
      available: true,
      legacyPath: 'policy-form/legacy/policy-form-legacy.component.ts',
      legacyRoute: 'policy-form/legacy',
    },
  ];
}
