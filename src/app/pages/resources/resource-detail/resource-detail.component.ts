import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Hold } from '../../../core/models/hold.model';
import { Resource } from '../../../core/models/resource.model';
import { HoldService } from '../../../core/services/hold.service';
import { ResourceService } from '../../../core/services/resource.service';
import { ToastService } from '../../../core/services/toast.service';
import { available, barClass, errText, held, holdChip, util } from '../../../core/util';

@Component({ selector: 'app-resource-detail', 
  imports: [RouterLink, DatePipe, ReactiveFormsModule], 
  templateUrl: './resource-detail.component.html',
  styleUrl:'./resource-details.component.css'
 })
export class ResourceDetailComponent {
  readonly id = input.required<string>();

  private readonly rs = inject(ResourceService); 
  
  private readonly hs = inject(HoldService); 
  
  private readonly toast = inject(ToastService);

  readonly util = util; 
  
  readonly available = available; 
  
  readonly held = held; 
  
  readonly barClass = barClass; 
  
  readonly chip = holdChip;

  readonly loading = signal(true); 

  readonly error = signal(''); 

  readonly editing = signal(false);
  
  readonly busy = signal(false); 
  
  readonly formError = signal('');

  readonly resource = signal<Resource | null>(null); 

  readonly holds = signal<Hold[]>([]);
  
  readonly cap = new FormControl(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] });
  readonly pct = computed(() => { const r = this.resource(); return r ? util(r) : 0; });
  constructor() { effect(() => { const id = this.id(); untracked(() => this.load(id)); }); }
  load(id: string) {
    this.loading.set(true); this.error.set('');
    forkJoin({ r: this.rs.getById(id), h: this.hs.list({ resourceId: id }) }).subscribe({
      next: ({ r, h }) => { this.resource.set(r); this.holds.set(h); this.loading.set(false); },
      error: e => { this.error.set(errText(e, 'Could not load this resource.')); this.loading.set(false); } });
  }
  openEdit() { this.cap.setValue(this.resource()!.capacity); this.formError.set(''); this.editing.set(true); }
  saveCap() {
    this.busy.set(true); this.formError.set('');
    this.rs.updateCapacity(this.id(), { capacity: this.cap.value }).subscribe({
      next: r => { this.resource.set(r); this.editing.set(false); this.busy.set(false); this.toast.show('Capacity updated'); },
      error: e => { this.formError.set(errText(e)); this.busy.set(false); } });
  }
  release(h: Hold) {
    if (!confirm(`Release ${h.quantity} unit(s) held by ?`)) return;
    this.hs.release(h.id).subscribe({ next: () => { this.toast.show('Hold released'); this.load(this.id()); }, error: e => this.toast.show(errText(e)) });
  }
}
