import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

interface LabExercise {
  slug: string;
  title: string;
  summary: string;
  jdRequirement: string;
  available: boolean;
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
    },
    {
      slug: 'incidents-store',
      title: '2 · incidents-store',
      summary: 'RxJS con nested subscribes y sin cleanup → composición limpia con takeUntilDestroyed.',
      jdRequirement: 'RxJS avanzado, NgRx o Signals',
      available: true,
    },
    {
      slug: 'auth',
      title: '3 · auth',
      summary: 'Interceptor + guard funcionales para OAuth2/JWT, con refresh token sin loops infinitos.',
      jdRequirement: 'Interceptores, guards, OAuth2/JWT',
      available: true,
    },
    {
      slug: 'graphql-quotes',
      title: '4 · graphql-quotes',
      summary: 'REST vs GraphQL con httpResource/rxResource, loading/error como signals.',
      jdRequirement: 'APIs RESTful y GraphQL',
      available: true,
    },
  ];
}
