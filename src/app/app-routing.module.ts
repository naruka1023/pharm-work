import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LandingPageRealComponent } from './landing-page/landing-page.component';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LandingPageComponent } from './pharmacist/landing-page.component';
import { PharmaHomeComponent } from './pharmacist/page/pharma-home/pharma-home.component';

const ssrRoutes: Routes = [
  {
    path: '',
    component: LandingPageComponent, // ✅ SSR route
    children: [{ path: '', component: PharmaHomeComponent }],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ssrRoutes, {
      initialNavigation: 'enabledBlocking', // Required for SSR
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
    // Client-only routes are dynamically added after bootstrap
    const platformId = inject(PLATFORM_ID);
    if (isPlatformBrowser(platformId)) {
      import('./app-routing.csr').then(({ addClientRoutes }) =>
        addClientRoutes(router)
      );
    }
  }
}
