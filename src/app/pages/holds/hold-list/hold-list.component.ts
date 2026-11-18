import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Hold, HoldStatus } from '../../../core/models/hold.model';
import { HoldService } from '../../../core/services/hold.service';
import { ToastService } from '../../../core/services/toast.service';
import { errText, holdChip } from '../../../core/util';

@Component({ 
  selector: 'app-hold-list', 
  imports: [RouterLink, DatePipe], 
  templateUrl: './hold-list.component.html' ,
  styleUrl:'./holds.component.css'
})
export class HoldListComponent {

  private readonly api = inject(HoldService); 

  private readonly toast = inject(ToastService);

  readonly chip = holdChip;

  readonly filters: { label: string; v?: HoldStatus }[] = 
  [
    { label: 'All' }, 
    { label: 'held', v: 'HELD' }, 
    { label: 'Released', v: 'RELEASED' }, 
    { label: 'Expired', v: 'EXPIRED' }
  ];
  readonly status = signal<HoldStatus | undefined>(undefined);

  readonly loading = signal(true);
  
  readonly error = signal(''); 
  
  readonly holds = signal<Hold[]>([]);

  constructor() { this.load(); }

  setFilter(v?: HoldStatus) { 
    this.status.set(v); 
    this.load(); 
  }


  load() {
    this.loading.set(true); 

    this.error.set('');

    this.api.list({ status: this.status() }).subscribe({
      next: h => { 
        this.holds.set(h); 
        this.loading.set(false);
       },
      error: () => { 
        
        this.error.set('Could not load holds.'); 
        this.loading.set(false);
       } });
  }

  release(h: Hold) {
    if (!confirm(`Release ${h.quantity} unit(s) held by ?`)) return;
    this.api.release(h.id).subscribe({ next: () => { this.toast.show('Hold released'); this.load(); }, error: e => this.toast.show(errText(e)) });
  }
}
