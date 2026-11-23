
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Component, HostListener, computed, effect, inject, signal, viewChild, ElementRef } from '@angular/core';
import { WorkspaceSwitcherComponent } from '../../pages/workspace/switch-workspace/workspace-switcher.component';
import {
  LucideDynamicIcon,
  LucidePanelLeft,
  LucidePanelsTopLeft,
  LucideDatabase,
  LucideBookmark,
  LucideUsersRoundCollaboration,
  LucideListClock,
  LucideSettings,
  LucideCalendarCheck,
  LucideBell,
  LucideUserRound,
  LucideX
} from '@lucide/angular';

@Component({ 
  selector: 'app-console-shell',
  standalone : true,
  imports: [
  WorkspaceSwitcherComponent,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  LucideDynamicIcon,
  LucideBell,
  LucidePanelLeft,LucideUserRound,LucideX
  
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
          link: '/console/settings',
          exact: false
        },
    ]
  },
 
];

 
  // initial() { return (this.auth.name() || this.auth.email() || '?').charAt(0).toUpperCase(); }
  search(e: Event, q: string) { e.preventDefault(); this.router.navigate(['/console/resources'], { queryParams: { q: q.trim() || null } }); }


    private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

    readonly initial = computed(() => {
      const u = this.auth.currentUser();
      const name = u?.fullName?.trim();
      if (name) {
        const p = name.split(/\s+/);
        return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
      }
      return (u?.email?.[0] ?? '?').toUpperCase();
    });

    constructor() {
      effect(() => {
        const open = this.menu();
        document.body.style.overflow = open ? 'hidden' : '';          // يمنع تمرير الصفحة خلف اللوحة
        if (open) queueMicrotask(() => this.closeBtn()?.nativeElement.focus());
      });
    }

    toggle(): void { this.menu.update(v => !v); }
    close(): void  { this.menu.set(false); }

    @HostListener('document:keydown.escape')
    onEscape(): void { this.close(); }
}
