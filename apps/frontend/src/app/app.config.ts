import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideAuth, withAppInitializerAuthCheck } from 'angular-auth-oidc-client';

import { logtoAuthInterceptor } from './core/interceptors/logto-auth.interceptor';
import { routes } from './app.routes';


const LOGTO_ENDPOINT = 'https://d1b3cj.logto.app';
const LOGTO_APP_ID = 'r6ezkh88cu89fjh9bv39g';
const BACKEND_API_RESOURCE = 'http://localhost:3000/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([logtoAuthInterceptor])),
    provideAuth({
      config: {
        authority: `${LOGTO_ENDPOINT}/oidc`,
        clientId: LOGTO_APP_ID,
        customParamsAuthRequest: {
          resource: BACKEND_API_RESOURCE
        },
        customParamsCodeRequest: {
          resource: BACKEND_API_RESOURCE
        },
        autoUserInfo: false,
        renewUserInfoAfterTokenRenew: false,

        redirectUrl: 'http://localhost:4200/callback',
        postLogoutRedirectUri: 'http://localhost:4200/',

        responseType: 'code',
        scope: 'openid profile email offline_access read:decks write:decks',

        useRefreshToken: true,
        silentRenew: true,
      },
    }, withAppInitializerAuthCheck()),
    provideRouter(routes)
  ]
};
