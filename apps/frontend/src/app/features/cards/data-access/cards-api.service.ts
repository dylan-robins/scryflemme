import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { CardsPage } from '@scryflemme/types';

@Injectable({
  providedIn: 'root'
})
export class CardsApiService {
  private readonly http = inject(HttpClient);

  getCards(page: number, pageSize: number, setCode: string | null): Observable<CardsPage> {
    return this.http.get<CardsPage>('/api/cards', {
      params: {
        page,
        pageSize,
        ...(setCode ? { setCode } : {})
      }
    });
  }
}
