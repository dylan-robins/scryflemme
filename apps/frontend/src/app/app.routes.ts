import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'callback',
    loadComponent: () =>
      import('./features/auth/pages/auth-callback-page/auth-callback-page.component').then(
        (module) => module.AuthCallbackPageComponent
      )
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/pages/profile-page/profile-page.component').then(
        (module) => module.ProfilePageComponent
      )
  },
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
