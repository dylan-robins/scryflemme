import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/cards/pages/cards-browser-page/cards-browser-page.component').then(
        (module) => module.CardsBrowserPageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
