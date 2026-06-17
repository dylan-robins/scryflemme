import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CardsBrowserPageComponent } from './cards-browser-page.component';

describe('CardsBrowserPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsBrowserPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();
  });

  it('renders the first page of cards and paginates forward', () => {
    const fixture = TestBed.createComponent(CardsBrowserPageComponent);
    fixture.detectChanges();

    const http = TestBed.inject(HttpTestingController);
    const firstRequest = http.expectOne('/api/cards?page=1&pageSize=12');
    expect(firstRequest.request.method).toBe('GET');
    firstRequest.flush({
      meta: {
        sourceFile: 'D&P - Liste des cartes publique.xlsx',
        extractedAt: '2026-06-14T01:02:15+00:00',
        cardCount: 124,
        notes: []
      },
      sets: [
        {
          code: 'STR',
          label: 'Série 1',
          name: "L'Aventure",
          uniqueCards: 22,
          totalCopiesInProduct: 23
        },
        {
          code: 'S2',
          label: 'Série 2',
          name: 'Découvertes magiques',
          uniqueCards: 32,
          totalCopiesInProduct: 32
        }
      ],
      cards: [
        {
          id: 'str-00',
          slug: 'str-00-esbroufe-sac-de-sable',
          setCode: 'STR',
          setLabel: 'Série 1',
          setName: "L'Aventure",
          number: '00',
          copiesInProduct: 2,
          name: 'Esbroufe - Sac de sable',
          cardClass: 'N/A',
          value: 'N/A',
          type: null,
          archetype: null,
          rarity: 'Commune',
          effect: null
        }
      ],
      activeSetCode: null,
      page: 1,
      pageSize: 12,
      total: 124,
      totalPages: 11
    });

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Esbroufe - Sac de sable');

    const nextButton = Array.from(compiled.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Next'
    ) as HTMLButtonElement;
    expect(nextButton).toBeTruthy();
    nextButton.click();
    fixture.detectChanges();

    const secondRequest = http.expectOne('/api/cards?page=2&pageSize=12');
    secondRequest.flush({
      meta: {
        sourceFile: 'D&P - Liste des cartes publique.xlsx',
        extractedAt: '2026-06-14T01:02:15+00:00',
        cardCount: 124,
        notes: []
      },
      sets: [
        {
          code: 'STR',
          label: 'Série 1',
          name: "L'Aventure",
          uniqueCards: 22,
          totalCopiesInProduct: 23
        },
        {
          code: 'S2',
          label: 'Série 2',
          name: 'Découvertes magiques',
          uniqueCards: 32,
          totalCopiesInProduct: 32
        }
      ],
      cards: [
        {
          id: 'str-12',
          slug: 'str-12-maingicienne',
          setCode: 'STR',
          setLabel: 'Série 1',
          setName: "L'Aventure",
          number: '12',
          copiesInProduct: 1,
          name: 'Maingicienne',
          cardClass: 'Magie',
          value: 4,
          type: null,
          archetype: null,
          rarity: 'Commune',
          effect: 'Choisissez une carte Magie dans votre défausse et ajoutez-la à votre main.'
        }
      ],
      activeSetCode: null,
      page: 2,
      pageSize: 12,
      total: 124,
      totalPages: 11
    });

    fixture.detectChanges();

    expect(compiled.textContent).toContain('Maingicienne');

    const setButton = Array.from(compiled.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'S2 · 32'
    ) as HTMLButtonElement;
    expect(setButton).toBeTruthy();
    setButton.click();
    fixture.detectChanges();

    const filteredRequest = http.expectOne('/api/cards?page=1&pageSize=12&setCode=S2');
    filteredRequest.flush({
      meta: {
        sourceFile: 'D&P - Liste des cartes publique.xlsx',
        extractedAt: '2026-06-14T01:02:15+00:00',
        cardCount: 124,
        notes: []
      },
      sets: [
        {
          code: 'STR',
          label: 'Série 1',
          name: "L'Aventure",
          uniqueCards: 22,
          totalCopiesInProduct: 23
        },
        {
          code: 'S2',
          label: 'Série 2',
          name: 'Découvertes magiques',
          uniqueCards: 32,
          totalCopiesInProduct: 32
        }
      ],
      cards: [
        {
          id: 's2-00',
          slug: 's2-00-roi-des-bouquins',
          setCode: 'S2',
          setLabel: 'Série 2',
          setName: 'Découvertes magiques',
          number: '00',
          copiesInProduct: 1,
          name: 'Roi des bouquins',
          cardClass: 'Soutien',
          value: -2,
          type: null,
          archetype: null,
          rarity: 'Rare',
          effect: 'Piochez une carte supplémentaire.'
        }
      ],
      activeSetCode: 'S2',
      page: 1,
      pageSize: 12,
      total: 32,
      totalPages: 3
    });

    fixture.detectChanges();

    expect(compiled.textContent).toContain('Roi des bouquins');

    http.verify();
  });
});
