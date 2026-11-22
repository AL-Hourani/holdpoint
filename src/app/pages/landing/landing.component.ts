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
  icon:string;
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

  private tile(id: string, name: string, available = false , icon = `/${id.toLowerCase()}.svg`): AppTile {
    return { id, name, available, route: `/apps/${id}` , icon};
  }

  readonly apps: AppTile[] = [
    { ...this.tile('Holdpoint', 'Holdpoint', true), route: '/console' ,  },
    { ...this.tile('Bookings', 'Bookings', false), route: '/console' ,  },

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