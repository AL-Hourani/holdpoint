import { Component, inject } from '@angular/core';
import { WorkspaceService } from '../services/workspace.service';
import { LucideChevronDown , LucideLayers } from '@lucide/angular';
@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [LucideChevronDown, LucideLayers ],
  templateUrl: './workspace-switcher.component.html',
  styleUrl: './workspace-switcher.component.css',
})
export class WorkspaceSwitcherComponent {
  readonly ws = inject(WorkspaceService);

  onChange(event: Event): void {
    this.ws.select((event.target as HTMLSelectElement).value);
  }
}