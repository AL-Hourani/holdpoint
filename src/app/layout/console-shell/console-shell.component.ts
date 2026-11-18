import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

import {
  LucideDynamicIcon,
  LucidePanelLeft,
  LucideSearch,
  LucidePlus,
  LucideLogOut,
  LucideLayersPlus,
  LucidePanelsTopLeft,
  LucideDatabase,
  LucideBookmark,
  LucideClipboardClock,
  LucideUsersRoundCollaboration,
  LucideListClock,
  LucideSettings,
  LucideCalendarCheck,
  LucideCircleHelp,
  LucideBell
} from '@lucide/angular';

@Component({ 
  selector: 'app-console-shell',
  standalone : true,
  imports: [
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  LucideDynamicIcon,
  LucideCalendarCheck,
  LucideCircleHelp,
  LucideBell
],
  templateUrl: './console-shell.component.html' ,
  styleUrl:'./console-layout.component.css'
})

export class ConsoleShellComponent {

  
  readonly auth = inject(AuthService);
  readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly open = signal(window.innerWidth > 960);
  readonly menu = signal(false);

readonly nav = [
  {
    h: 'Dashboard',
    items: [
      {
        icon: LucidePanelsTopLeft,
        label: 'Overview',
        link: '/console',
        exact: true
      }
    ]
  },
  {
    h: 'Operations',
    items: [
      {
        icon: LucideDatabase,
        label: 'Resources',
        link: '/console/resources',
        exact: false
      },
      {
        icon:   LucideBookmark,
        label: 'Holds',
        link: '/console/holds',
        exact: false
      },
      {
        icon:  LucideClipboardClock,
        label: 'Bookings',
        link: '/console/bookings',
        exact: false
      },
    ]
  },
      {
      h: 'Workspace',
      items: [
        {
          icon: LucideUsersRoundCollaboration,
          label: 'Team',
          link: '/console/team',
          exact: false
        },
    ]
  },
      {
      h: 'Administration',
      items: [
        {
          icon: LucideListClock,
          label: 'Activity log',
          link: '/console/activity',
          exact: false
        },
        {
          icon: LucideSettings,
          label: 'Settings',
          link: '/settings',
          exact: false
        },
    ]
  },
 
];
  // initial() { return (this.auth.name() || this.auth.email() || '?').charAt(0).toUpperCase(); }
  search(e: Event, q: string) { e.preventDefault(); this.router.navigate(['/console/resources'], { queryParams: { q: q.trim() || null } }); }
}
