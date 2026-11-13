import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({ selector: 'app-console-shell', imports: [RouterOutlet, RouterLink, RouterLinkActive], templateUrl: './console-shell.component.html' })
export class ConsoleShellComponent {
  readonly auth = inject(AuthService);
  readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly open = signal(window.innerWidth > 960);
  readonly menu = signal(false);
  readonly nav = [
    { h: 'Dashboard', items: [{ icon: 'dashboard', label: 'Overview', link: '/console', exact: true }] },
    { h: 'Reservations', items: [
      { icon: 'inventory_2', label: 'Resources', link: '/console/resources', exact: false },
      { icon: 'bookmark_added', label: 'Holds', link: '/console/holds', exact: false },
    ] },
    { h: 'Quick create', items: [
      { icon: 'add_box', label: 'New resource', link: '/console/resources/new', exact: true },
      { icon: 'add_task', label: 'New hold', link: '/console/holds/new', exact: true },
    ] },
  ];
  initial() { return (this.auth.name() || this.auth.email() || '?').charAt(0).toUpperCase(); }
  search(e: Event, q: string) { e.preventDefault(); this.router.navigate(['/console/resources'], { queryParams: { q: q.trim() || null } }); }
}
