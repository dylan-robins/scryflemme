import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { OidcSecurityService } from 'angular-auth-oidc-client';

import { AppHeaderComponent } from './shared/ui/app-header.component';

@Component({
  selector: 'app-root',
  imports: [AppHeaderComponent, RouterOutlet],
  template: `
    <div class="min-h-screen bg-[color:var(--theme-bg)] text-[color:var(--theme-text)]">
      <div class="relative isolate min-h-screen overflow-hidden">
        <div class="absolute inset-0 -z-10 bg-[var(--theme-page-gradient)]"></div>

        <app-header />

        <router-outlet />
      </div>
    </div>
  `,
  styleUrl: './app.css',
  host: {
    'data-theme': 'midnight-procrastination'
  }
})
export class App implements OnInit {
  private readonly oidc = inject(OidcSecurityService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.oidc.checkAuth().subscribe({
      next: (response) => {
        if (window.location.pathname === '/callback') {
          void this.router.navigateByUrl(response.isAuthenticated ? '/profile' : '/');
        }
      },
      error: (error) => {
        console.error('Failed to initialize auth state', error);
      }
    });
  }
}
