import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { errText } from '../../../core/util';
import { finalize } from 'rxjs';
import { 
  LucideArrowRight,
  LucideUserRound,
  LucideMail
 } from '@lucide/angular';

@Component({ 
  selector: 'app-register', 
  standalone : true,
  imports: [
    ReactiveFormsModule, 
    RouterLink ,
    LucideArrowRight,
    LucideUserRound,
    LucideMail
  ], 
  templateUrl: './register.component.html',
  styleUrl : './register.component.css',
 })
export class RegisterComponent {

  private readonly auth = inject(AuthService); 

  private readonly router = inject(Router);

  readonly busy = signal(false); 
  readonly error = signal('');

  readonly form = inject(FormBuilder).nonNullable.group(
    { 
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(8)]] 
    });


 submit() {
  if (this.form.invalid || this.busy()) {
    this.form.markAllAsTouched();
    return;
  }
  

  this.busy.set(true);
  this.error.set('');

  this.auth.register(this.form.getRawValue())

    .pipe(
      finalize(() => this.busy.set(false))
    )
    .subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },

      error: (e) => {
        this.error.set(
          errText(e, 'Could not create the account.')
        );
      }
    });
}
}
