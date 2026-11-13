import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', title: 'Holdora — Resource reservations', loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', title: 'Sign in · Holdora', canActivate: [guestGuard], loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', title: 'Create account · Holdora', canActivate: [guestGuard], loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'console', canActivate: [authGuard], loadComponent: () => import('./layout/console-shell/console-shell.component').then(m => m.ConsoleShellComponent),
    children: [
      { path: '', pathMatch: 'full', title: 'Overview · Holdora', loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent) },
      { path: 'resources', title: 'Resources · Holdora', loadComponent: () => import('./pages/resources/resource-list/resource-list.component').then(m => m.ResourceListComponent) },
      { path: 'resources/new', title: 'Create resource · Holdora', loadComponent: () => import('./pages/resources/resource-create/resource-create.component').then(m => m.ResourceCreateComponent) },
      { path: 'resources/:id', title: 'Resource · Holdora', loadComponent: () => import('./pages/resources/resource-detail/resource-detail.component').then(m => m.ResourceDetailComponent) },
      { path: 'holds', title: 'Holds · Holdora', loadComponent: () => import('./pages/holds/hold-list/hold-list.component').then(m => m.HoldListComponent) },
      { path: 'holds/new', title: 'Create hold · Holdora', loadComponent: () => import('./pages/holds/hold-create/hold-create.component').then(m => m.HoldCreateComponent) },
    ] },
  { path: '**', redirectTo: '' },
];
