import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  LucideArrowUpRight,
  LucideArrowRight,
  LucideLayoutDashboard,
  LucideBookmarkCheck,
  LucideShieldCheck,
  LucideCheck,
  LucideGauge,
  LucideLayers,
  LucideDatabase,
  LucideClock3,
  LucideBadgeCheck
} from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({ 
  selector: 'app-landing', 
  imports: [RouterLink,
  LucideArrowUpRight,
  LucideArrowRight,

  LucideShieldCheck,
  LucideCheck,
  LucideLayers,

  ], 
  templateUrl: './landing.component.html' ,
  styleUrl : './landing.component.css'

})
export class LandingComponent {

  readonly auth = inject(AuthService);

  readonly preview = [{ n: 'Conference Room A', c: 12, h: 12 }, { n: 'GPU Cluster 01', c: 8, h: 6 }, { n: 'Pro License Pool', c: 50, h: 35 }, { n: 'Loading Dock 3', c: 4, h: 2 }];
  readonly feats = [
    { i: 'verified', t: 'Capacity you can trust', d: 'Every hold is validated against remaining capacity, so a resource can never be overbooked.' },
    { i: 'key', t: 'Unique resource keys', d: 'Each resource has one readable key, enforced on creation.' },
    { i: 'travel_explore', t: 'Find anything fast', d: 'Look up by ID or key, search from anywhere in the console.' },
    { i: 'tune', t: 'Safe capacity changes', d: 'Capacity updates are checked against active holds before they apply.' },
    { i: 'bookmark_added', t: 'Full hold lifecycle', d: 'Create, track, filter and release holds with clear Active, Released and Expired states.' },
    { i: 'lock', t: 'Secure by default', d: 'Token authentication on every request and automatic sign-out on expiry.' },
  ];
  pct(h: number, c: number) { return Math.round((h / c) * 100); }
}
