import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// TODO: adjust this import to where your AuthService lives
import { AuthService } from '../../core/services/auth.service';
import { LucideUserRound } from '@lucide/angular';
export interface AppTile {
  id: string;
  name: string;
  route: string;
  available: boolean;
  c1: string; // icon gradient top
  c2: string; // icon gradient bottom
  icon: string[]; // svg path data, 24x24 grid
}

const PURPLE = ['#b866f0', '#8b3fe0'];
const BLUE = ['#6a9bff', '#3d63e8'];
const GREEN = ['#6bd674', '#33ad43'];
const PINK = ['#ff7a95', '#f1456c'];
const ORANGE = ['#ffb53d', '#f7870f'];
const TEAL = ['#34d6c2', '#0f9d92'];
const RED = ['#ff8077', '#ee4f55'];

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterLink,
    LucideUserRound
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private tile(id: string, name: string, [c1, c2]: string[], icon: string[], available = false): AppTile {
    return { id, name, c1, c2, icon, available, route: `/apps/${id}` };
  }

  readonly apps: AppTile[] = [
    { ...this.tile('Holdpoint', 'Holdpoint', BLUE, [
      'M38 26h-8a6 6 0 0 0-6 6v32a6 6 0 0 0 6 6h8','M58 26h8a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6h-8'
    ], true), route: '/console' },
    { ...this.tile('Bookings', 'Bookings', PURPLE, [
      'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z', 'M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1',
    ], false), route: '/console' },

  ];

  open(app: AppTile): void {
    if (!app.available) return;
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl(app.route);
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: app.route } });
    }
  }
}