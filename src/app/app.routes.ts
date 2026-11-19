import { Routes } from '@angular/router';
// import { authGuard, guestGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', title: 'Alhourani — Ecosystem of specialized business applications', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', title: 'Sign in · Holdpoint', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  
  { path: 'register', title: 'Create account · Holdpoint', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./pages/auth/verify-email/verify-email')
        .then(m => m.VerifyEmailComponent),
  },
  {
    path: 'workspaces/create',
    loadComponent: () =>
      import('./pages/workspace/create-workspace/create-workspace.component')
        .then(m => m.CreateWorkspaceComponent)
  },
  { path: 'pricing', title: 'Alhourani . pricing', loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent) },
  {
    path : "settings" , loadComponent : () => import('./pages/settings/security/security').then(m => m.SecurityComponent),
    // children :[
    //    { path: 'security', title: 'Security · Holdpoint', loadComponent: () => import('./pages/settings/security/security').then(m => m.SecurityComponent) },
    // ]
  },
  { path: 'console', loadComponent: () => import('./layout/console-shell/console-shell.component').then(m => m.ConsoleShellComponent),
    children: [
      { path: '', pathMatch: 'full', title: 'Overview · Holdpoint', loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent) },
      { path: 'resources', title: 'Resources · Holdpoint', loadComponent: () => import('./pages/resources/resource-list/resource-list.component').then(m => m.ResourceListComponent) },
      { path: 'resources/new', title: 'Create resource · Holpoint', loadComponent: () => import('./pages/resources/resource-create/resource-create.component').then(m => m.ResourceCreateComponent) },
      { path: 'resources/:id', title: 'Resource · Holdpoint', loadComponent: () => import('./pages/resources/resource-detail/resource-detail.component').then(m => m.ResourceDetailComponent) },
      { path: 'holds', title: 'Holds · Holdpoint', loadComponent: () => import('./pages/holds/hold-list/hold-list.component').then(m => m.HoldListComponent) },
      { path: 'holds/new', title: 'Create hold · Holdpoint', loadComponent: () => import('./pages/holds/hold-create/hold-create.component').then(m => m.HoldCreateComponent) },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./pages/bookings/bookings.component')
            .then(m => m.BookingsComponent)
      }
      ,{
          path: 'team',
          loadComponent: () =>
            import('./pages/team/team.component')
              .then(m => m.TeamComponent)
        },
        {
          path: 'activity',
          loadComponent: () =>
            import('./pages/activity/activity.component')
              .then(m => m.ActivityComponent)
        },

        {
          path: 'support',
          loadComponent: () =>
            import('./pages/support/support-center.component')
              .then(m => m.SupportCenterComponent)
        },
        {
          path: 'notifications',
          loadComponent: () =>
            import('./pages/notifications/notifications-center.component')
              .then(m => m.NotificationsCenterComponent)
        }

    ] },
  { path: '**', redirectTo: '' },

];
