import { Component, inject, signal } from '@angular/core';
import { WorkspaceService } from '../services/workspace.service';
import { LucideChevronDown , LucideLayers } from '@lucide/angular';
import { WorkspaceResponse } from '../models/workspace.model';
@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [LucideChevronDown, LucideLayers ],
  templateUrl: './workspace-switcher.component.html',
  styleUrl: './workspace-switcher.component.css',
})
export class WorkspaceSwitcherComponent {
  readonly ws = inject(WorkspaceService);

  readonly workspaces = signal<WorkspaceResponse[]>([]);

  readonly error = signal('');

  onChange(event: Event): void {

    console.log(this.ws.getMyWorkspaces())
    this.ws.select((event.target as HTMLSelectElement).value);
  }

  constructor() {
    this.ws.getMyWorkspaces().subscribe(
      {
        next : w => {
          this.workspaces.set(w)
          console.log(w);
        },
        error : r => {
          this.error.set('Could not load workspaces.'); 
        }
      }
    )
  }
}