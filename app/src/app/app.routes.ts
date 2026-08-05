import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.Home),
    title: 'PolicyHub — Senior Angular Challenge Prep',
  },
  {
    path: 'quiz',
    loadChildren: () => import('./features/quiz/quiz.routes').then((m) => m.QUIZ_ROUTES),
    title: 'Quiz',
  },
  {
    path: 'lab',
    loadChildren: () => import('./features/lab/lab.routes').then((m) => m.LAB_ROUTES),
    title: 'Refactor Lab',
  },
  {
    path: 'live-coding',
    loadComponent: () =>
      import('./features/live-coding/live-coding.component').then((m) => m.LiveCoding),
    title: 'Live Coding Prep',
  },
  { path: '**', redirectTo: '' },
];
