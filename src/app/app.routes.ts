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
        path: 'society',
        loadComponent: () =>
          import('./features/society/components/flat-table/flat-table.component')
            .then(m => m.FlatTableComponent)
      },
      {
        path: 'flat-details',
        loadComponent: () =>
          import('./features/society/components/flat-table/flat-table.component')
            .then(m => m.FlatTableComponent)
      },
      {
        path: 'marketplace',
        loadComponent: () =>
          import('./features/marketplace/components/marketplace-list/marketplace-list.component')
            .then(m => m.MarketplaceListComponent)
      },
      {
        path: 'announcements',
        loadComponent: () =>
          import('./features/announcements/components/announcements-list/announcements-list.component')
            .then(m => m.AnnouncementsListComponent)
      },
      {
        path: 'residents',
        loadComponent: () =>
          import('./features/residents/components/residents-list/residents-list.component')
            .then(m => m.ResidentsListComponent)
      },
      {
        path: 'residents/create',
        loadComponent: () =>
          import('./features/residents/components/resident-create/resident-create.component')
            .then(m => m.ResidentCreateComponent)
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./features/complaints/components/complaints-list/complaints-list.component')
            .then(m => m.ComplaintsListComponent)
      },
      {
        path: 'visitors',
        loadComponent: () =>
          import('./features/visitors/components/visitors-list/visitors-list.component')
            .then(m => m.VisitorsListComponent)
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component')
            .then(m => m.SettingsComponent)
      }
    ]
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: ''
  }
];
