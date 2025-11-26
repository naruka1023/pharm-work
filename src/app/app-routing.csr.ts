import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { DemoLandingComponent } from './demo-landing/demo-landing.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { OperatorPageComponent } from './pharmacist/page/operator-page/operator-page.component';

export function addClientRoutes(router: Router) {
  router.resetConfig([
    ...router.config, // keep existing SSR routes

    { path: 'notifications', component: DemoLandingComponent },
    { path: 'success-checkout', component: DemoLandingComponent },
    { path: 'cancel-checkout', component: DemoLandingComponent },
    { path: 'confirm', component: ConfirmEmailComponent },

    {
      path: 'register',
      children: [
        { path: 'pharmacist', component: DemoLandingComponent },
        { path: 'operator', component: DemoLandingComponent },
        { path: 'student', component: DemoLandingComponent },
        {
          path: 'operator-page/:operatorUID',
          component: OperatorPageComponent,
        },
      ],
    },

    {
      path: 'pharma',
      loadChildren: () =>
        import('./pharmacist/pharmacist.module').then(
          (m) => m.PharmacistModule
        ),
    },
    {
      path: 'operator',
      loadChildren: () =>
        import('./operator/operator.module').then((m) => m.OperatorModule),
    },
  ]);
}
