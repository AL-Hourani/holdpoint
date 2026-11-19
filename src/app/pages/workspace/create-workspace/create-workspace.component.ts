
import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceService } from '../services/workspace.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-workspace',
  standalone: true,
  imports : [
    RouterLink
  ],
  templateUrl: './create-workspace.component.html',
  styleUrl: './create-workspace.component.css'
})

export class CreateWorkspaceComponent {

  private readonly workspaceService = inject(WorkspaceService);
  private readonly router = inject(Router);

  readonly name = signal('');
  readonly slug = signal('');

  readonly slugEdited = signal(false);
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly nameTouched = signal(false);
  readonly slugTouched = signal(false);

  readonly slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  readonly isNameValid = computed(() => {
    const value = this.name().trim();
    return value.length >= 2 && value.length <= 150;
  });

  readonly isSlugValid = computed(() => {
    const value = this.slug();
    return value.length >= 3 &&
      value.length <= 150 &&
      this.slugPattern.test(value);
  });

  readonly canSubmit = computed(() =>
    this.isNameValid() &&
    this.isSlugValid() &&
    !this.loading()
  );

  readonly previewUrl = computed(() =>
    `holdpoint.com/${this.slug() || 'your-workspace'}`
  );

  onNameChange(value: string): void {
    this.name.set(value);
    this.nameTouched.set(true);
    this.errorMessage.set('');

    if (!this.slugEdited()) {
      this.slug.set(this.generateSlug(value));
    }
  }

  onSlugChange(value: string): void {
    this.slugEdited.set(true);
    this.slugTouched.set(true);
    this.slug.set(this.generateSlug(value));
    this.errorMessage.set('');
  }

  private generateSlug(value: string): string {
    return value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 150);
  }

  resetSlug(): void {
    this.slugEdited.set(false);
    this.slug.set(this.generateSlug(this.name()));
  }

  createWorkspace(): void {
    this.nameTouched.set(true);
    this.slugTouched.set(true);

    if (!this.canSubmit()) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.workspaceService.create({
      name: this.name().trim(),
      slug: this.slug()
    }).subscribe({
      next: (workspace) => {
        this.loading.set(false);

        this.router.navigate([
          '/workspaces',
          workspace.slug
        ]);
      },
      error: (error) => {
        this.loading.set(false);

        if (error.status === 409) {
          this.errorMessage.set(
            'This workspace URL is already taken. Please choose another one.'
          );
        } else {
          this.errorMessage.set(
            error.error?.message ??
            'Something went wrong while creating your workspace. Please try again.'
          );
        }
      }
    });
  }
}
