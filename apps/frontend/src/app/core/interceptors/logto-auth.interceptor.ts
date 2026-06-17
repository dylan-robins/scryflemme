import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { OidcSecurityService } from 'angular-auth-oidc-client';

export const logtoAuthInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('/api/')) {
    return next(request);
  }

  const oidc = inject(OidcSecurityService);

  return combineLatest([
    oidc.getAccessToken().pipe(catchError(() => of(''))),
    oidc.getIdToken().pipe(catchError(() => of('')))
  ]).pipe(
    take(1),
    map(([accessToken, idToken]) =>
      request.clone({
        setHeaders: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          ...(idToken ? { 'X-Logto-Id-Token': idToken } : {})
        }
      })
    ),
    mergeMap((nextRequest) => next(nextRequest))
  );
};
