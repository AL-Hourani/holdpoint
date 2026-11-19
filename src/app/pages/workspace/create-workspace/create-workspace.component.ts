
import { Component, computed, inject, signal } from '@angular/core';
import { WorkspaceService } from '../services/workspace.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-workspace',
  standalone: true,
  imports : [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './create-workspace.component.html',
  styleUrl: './create-workspace.component.css'
})

export class CreateWorkspaceComponent {

  private readonly workspaceService = inject(WorkspaceService);
  private readonly router = inject(Router);


  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly nameTouched = signal(false);
  readonly slugTouched = signal(false);

  readonly slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  
  readonly form = inject(FormBuilder).nonNullable.group(
    {
      name : ['' , Validators.required , Validators.maxLength(150)],
      slug : ['' , Validators.required , Validators.maxLength(150)],
    }
  )


  readonly previewUrl = computed(() =>
    `holdpoint.com/${this.form.getRawValue().slug || 'your-workspace'}`
  );




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



  createWorkspace(): void {
    this.nameTouched.set(true);
    this.slugTouched.set(true);

    this.loading.set(true);
    this.errorMessage.set('');

    this.workspaceService.create(this.form.getRawValue()
    ).subscribe({
      next: (workspace) => {
        this.loading.set(false);

        this.router.navigate([
          '/console',
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
