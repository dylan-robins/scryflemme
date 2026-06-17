import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthCallbackPageComponent } from './auth-callback-page.component';

describe('AuthCallbackPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCallbackPageComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders the callback status copy', () => {
    const fixture = TestBed.createComponent(AuthCallbackPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Logto callback');
    expect(compiled.textContent).toContain('Completing sign-in');
  });
});
