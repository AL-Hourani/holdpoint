import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Resource } from '../../../core/models/resource.model';
import { ResourceService } from '../../../core/services/resource.service';
import { available, barClass, held, util } from '../../../core/util';

@Component({
  selector: 'app-resource-list', 
  imports: [RouterLink], 
  templateUrl: './resource-list.component.html',
 styleUrl : './resources.component.css'
 })
export class ResourceListComponent {
  readonly q = input(' ');

  readonly term = signal('');

  readonly util = util; 

  readonly available = available; 

  readonly held = held; 

  readonly barClass = barClass;

  readonly loading = signal(true); 

  readonly error = signal('');

  readonly resources = signal<Resource[]>([]);

  readonly rows = computed(() => { const t = this.term().toLowerCase(); 
  
  return this.resources().filter(r => r.name.toLowerCase().includes(t) || r.resourceKey.toLowerCase().includes(t)); });
  constructor() {
    inject(ResourceService).list().subscribe({
      next: r => { 
        this.resources.set(r); 
        this.loading.set(false); 
      },
      error: () => { 
        this.error.set('Could not load resources.'); 
        this.loading.set(false); 
      } });
  }
}
