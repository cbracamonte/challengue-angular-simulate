import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

interface RequirementMap {
  requirement: string;
  practiceWhere: string;
  routerLink: string;
  docFile: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatCardModule, MatChipsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class Home {
  protected readonly requirementMap: RequirementMap[] = [
    {
      requirement: 'Standalone Components + Signals (Angular 14→22)',
      practiceWhere: 'Lab · Ejercicio 1 — policy-list',
      routerLink: '/lab/policy-list',
      docFile: '01-standalone-signals-migration.md',
    },
    {
      requirement: 'RxJS avanzado, NgRx o Signals para estado',
      practiceWhere: 'Lab · Ejercicio 2 — incidents-store',
      routerLink: '/lab/incidents-store',
      docFile: '02-rxjs-memory-leaks.md',
    },
    {
      requirement: 'Interceptores, guards, OAuth2/JWT',
      practiceWhere: 'Lab · Ejercicio 3 — auth',
      routerLink: '/lab/auth',
      docFile: '05-oauth2-jwt-interceptors-guards.md',
    },
    {
      requirement: 'APIs RESTful y GraphQL',
      practiceWhere: 'Lab · Ejercicio 4 — graphql-quotes',
      routerLink: '/lab/graphql-quotes',
      docFile: '06-rest-vs-graphql.md',
    },
    {
      requirement: 'SASS/LESS, Tailwind, Angular Material, Bootstrap',
      practiceWhere: 'Quiz · Tema "Styling" + este mismo shell',
      routerLink: '/quiz?topic=styling',
      docFile: '07-sass-tailwind-material.md',
    },
    {
      requirement: 'Jasmine/Karma o Jest, Cypress o Playwright',
      practiceWhere: 'Quiz · Tema "Testing" + specs de cada ejercicio',
      routerLink: '/quiz?topic=testing',
      docFile: '08-jasmine-vs-jest.md',
    },
    {
      requirement: 'Git avanzado (Gitflow, PRs, Code Review)',
      practiceWhere: 'Live Coding · Checklist de Git Flow',
      routerLink: '/live-coding',
      docFile: '09-gitflow-code-review.md',
    },
    {
      requirement: 'Mentoría y comunicación técnico-negocio',
      practiceWhere: 'Live Coding · Guion de comunicación con cliente',
      routerLink: '/live-coding',
      docFile: '10-mentoring-communication.md',
    },
  ];
}
