import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Resource } from '../../../core/models/resource.model';
import { HoldService } from '../../../core/services/hold.service';
import { ResourceService } from '../../../core/services/resource.service';
import { ToastService } from '../../../core/services/toast.service';
import { available, errText } from '../../../core/util';

@Component({ selector: 'app-hold-create', imports: [ReactiveFormsModule, RouterLink], templateUrl: './hold-create.component.html' })
export class HoldCreateComponent {
  readonly resourceId = input<string>();
  private readonly hs = inject(HoldService); private readonly router = inject(Router); private readonly toast = inject(ToastService);
  readonly durations = [{ m: 15, l: '15 minutes' }, { m: 60, l: '1 hour' }, { m: 240, l: '4 hours' }, { m: 1440, l: '1 day' }, { m: 10080, l: '7 days' }];
  readonly busy = signal(false); readonly error = signal(''); readonly resources = signal<Resource[]>([]);
  readonly form = inject(FormBuilder).nonNullable.group({
    resourceId: ['', Validators.required], holderName: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]], durationMinutes: [60, Validators.required],
  });
  private readonly sel = toSignal(this.form.controls.resourceId.valueChanges, { initialValue: '' });
  private readonly qty = toSignal(this.form.controls.quantity.valueChanges, { initialValue: 1 });
  readonly selected = computed(() => this.resources().find(r => r.id === this.sel()) ?? null);
  readonly avail = computed(() => { const r = this.selected(); return r ? available(r) : null; });
  readonly tooMany = computed(() => this.avail() !== null && this.qty() > this.avail()!);
  constructor() {
    inject(ResourceService).list().subscribe(r => {
      this.resources.set(r);
      const pre = this.resourceId(); if (pre && r.some(x => x.id === pre)) this.form.controls.resourceId.setValue(pre);
    });
  }
  submit() {
    this.busy.set(true); this.error.set('');
    this.hs.create(this.form.getRawValue()).subscribe({
      next: () => { this.toast.show('Hold created'); this.router.navigateByUrl('/console/holds'); },
      error: e => { this.error.set(errText(e)); this.busy.set(false); } });
  }
}
