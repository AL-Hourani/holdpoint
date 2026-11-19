
import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { WorkspaceService } from '../services/workspace.service';
import { WorkspaceResponse } from '../models/workspace.model';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './workspaces.component.html',
  styleUrl: './workspaces.component.css'
})
export class WorkspacesComponent implements OnInit {

  private readonly workspaceService = inject(WorkspaceService);

  readonly workspaces = signal<WorkspaceResponse[]>([]);

  readonly searchTerm = signal('');

  readonly loading = signal(true);

  readonly errorMessage = signal<string | null>(null);

  readonly filteredWorkspaces = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.workspaces();
    }

    return this.workspaces().filter(workspace =>
      workspace.name.toLowerCase().includes(term) ||
      workspace.slug.toLowerCase().includes(term)
    );
  });

  readonly activeCount = computed(() =>
    this.workspaces().filter(w => w.status === 'ACTIVE').length
  );

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.workspaceService.getMyWorkspaces().subscribe({
      next: (workspaces) => {
        this.workspaces.set(workspaces);
        this.loading.set(false);
      },

      error: (error) => {
        console.error('Failed to load workspaces:', error);

        this.errorMessage.set(
          'We could not load your workspaces. Please try again.'
        );

        this.loading.set(false);
      }
    });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
  }

  trackById(_: number, workspace: WorkspaceResponse): string {
    return workspace.id;
  }
}
