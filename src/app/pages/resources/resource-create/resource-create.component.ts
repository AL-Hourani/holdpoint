import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ResourceService } from '../../../core/services/resource.service';
import { ToastService } from '../../../core/services/toast.service';
import { errText } from '../../../core/util';
import {
   LucideChevronRight ,
   LucidePackagePlus

} from '@lucide/angular';

@Component({ 
  selector: 'app-resource-create', 
  imports: [
    ReactiveFormsModule, 
    LucideChevronRight,
    LucidePackagePlus,
    RouterLink
  ], 
  templateUrl: './resource-create.component.html' ,
  styleUrl : './new-resource.component.css'
})
export class ResourceCreateComponent {
  private readonly api = inject(ResourceService); 

  private readonly router = inject(Router); 

  private readonly toast = inject(ToastService);

  readonly busy = signal(false); 

  readonly error = signal('');

  readonly form = inject(FormBuilder).nonNullable.group({

    resourceKey: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],

    name: ['', Validators.required],

    capacity: [1, [Validators.required, Validators.min(1)]],
  });
  submit() {
    this.busy.set(true);
    this.error.set('');
    this.api.create(this.form.getRawValue()).subscribe({
      next: r => { 
        this.toast.show('Resource created'); 
        this.router.navigate(['/console/resources', r.id]);
       },
      error: e => { 
        this.error.set(errText(e)); 
        this.busy.set(false);
      } });
  }
}
