import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideAuth } from 'angular-auth-oidc-client';

import { routes } from './app.routes';


const LOGTO_ENDPOINT = 'https://d1b3cj.logto.app';
const LOGTO_APP_ID = 'r6ezkh88cu89fjh9bv39g';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideAuth({
      config: {
        authority: `${LOGTO_ENDPOINT}/oidc`,
        clientId: LOGTO_APP_ID,

        redirectUrl: 'http://localhost:4200/callback',
        postLogoutRedirectUri: 'http://localhost:4200/',

        responseType: 'code',
        scope: 'openid profile email offline_access read:decks write:decks',

        useRefreshToken: true,
        silentRenew: true,
      },
    }),
    provideRouter(routes)
  ]
};
