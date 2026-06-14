import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { CardRecord, CatalogMeta, CatalogSet } from '../models/card.model';

export interface CardsPageResponse {
  meta: CatalogMeta;
  sets: CatalogSet[];
  cards: CardRecord[];
  activeSetCode: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class CardsApiService {
  private readonly http = inject(HttpClient);

  getCards(page: number, pageSize: number, setCode: string | null): Observable<CardsPageResponse> {
    return this.http.get<CardsPageResponse>('/api/cards', {
      params: {
        page,
        pageSize,
        ...(setCode ? { setCode } : {})
      }
    });
  }
}
