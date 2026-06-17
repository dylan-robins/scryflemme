import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type BackendUser = {
  userID: number;
  logtoSubject: string;
  email: string | null;
  name: string | null;
};

@Injectable({
  providedIn: 'root'
})
export class SessionApiService {
  private readonly http = inject(HttpClient);

  getCurrentUser(): Observable<BackendUser> {
    return this.http.get<BackendUser>('/api/me');
  }
}
