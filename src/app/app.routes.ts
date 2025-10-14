import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/layout.component'; // standalone component

export const routes: Routes = [
  // Landing page and login - no sidebar
  {
    path: '',
    loadComponent: () =>
      import('./components/page/landing-page/landing-page.component')
        .then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  // All authenticated pages wrapped inside MainLayoutComponent
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin-dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'flat-details',
        loadComponent: () =>
          import('./features/society/components/flat-table/flat-table.component')
            .then(m => m.FlatTableComponent)
      }
      // ,
      // {
      //   path: 'settings',
      //   loadComponent: () =>
      //     import('./features/admin-dashboard/settings/settings.component')
      //       .then(m => m.SettingsComponent)
      // }
    ]
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: ''
  }
];
