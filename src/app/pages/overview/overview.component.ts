import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Hold } from '../../core/models/hold.model';
import { Resource } from '../../core/models/resource.model';
import { HoldService } from '../../core/services/hold.service';
import { ResourceService } from '../../core/services/resource.service';
import { barClass, held, holdChip, util } from '../../core/util';
import {
  LucideBookmarkPlus,
  LucidePlus,
  LucideCircleAlert,
  LucidePackage,
  LucideBookmarkCheck,
  LucideLayers,
  LucideBoxes,
  LucideGauge,
  LucideDatabase,
  LucideActivity,
  LucideArrowUpRight,
  LucideChevronRight,
  LucideArrowRight,
  LucidePackageOpen,
  LucideChartNoAxesCombined,
  LucideCalendarClock,
  LucidePackagePlus
} from '@lucide/angular';

@Component({ 
  selector: 'app-overview', 
  imports: [RouterLink, DatePipe,
  LucideBookmarkPlus,
  LucidePlus,
  LucideCircleAlert,
  LucidePackage,
  LucideBookmarkCheck,
  LucideLayers,
  LucideBoxes,
  LucideGauge,
  LucideDatabase,
  LucideActivity,
  LucideArrowUpRight,
  LucideChevronRight,
  LucideArrowRight,
  LucidePackageOpen,
  LucideChartNoAxesCombined,
  LucideCalendarClock,
  LucidePackagePlus
  ], 
  templateUrl: './overview.component.html' ,
  styleUrl :'./overview.component.css'
})
export class OverviewComponent {
  readonly util = util;
  
  readonly barClass = barClass; 
  readonly chip = holdChip;

  readonly loading = signal(true); 

  readonly error = signal('');
  readonly resources = signal<Resource[]>([]); 
  
  readonly holds = signal<Hold[]>([]);
  readonly totalCap = computed(() => this.resources().reduce((s, r) => s + r.capacity, 0));
  readonly totalHeld = computed(() => this.resources().reduce((s, r) => s + held(r), 0));
  readonly pct = computed(() => (this.totalCap() ? Math.round((this.totalHeld() / this.totalCap()) * 100) : 0));
  readonly activeCount = computed(() => this.holds().filter(h => h.status === 'HELD').length);
  readonly top = computed(() => [...this.resources()].sort((a, b) => util(b) - util(a)).slice(0, 6));
  readonly recent = computed(() => this.holds().slice(0, 6));
  constructor() {
    forkJoin({ r: inject(ResourceService).list(), h: inject(HoldService).list() }).subscribe({
      next: ({ r, h }) => { this.resources.set(r); this.holds.set(h); this.loading.set(false); },
      error: () => { this.error.set('Could not load the overview.'); this.loading.set(false); } });
  }
}
