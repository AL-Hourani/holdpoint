import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { errText } from '../../../core/util';
@Component({ selector: 'app-register', imports: [ReactiveFormsModule, RouterLink], templateUrl: './register.component.html' })
export class RegisterComponent {
  private readonly auth = inject(AuthService); private readonly router = inject(Router);
  readonly busy = signal(false); readonly error = signal('');
  readonly form = inject(FormBuilder).nonNullable.group({ name: ['', Validators.required], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]] });
  submit() {
    this.busy.set(true); this.error.set('');
    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/console'),
      error: e => { this.error.set(errText(e, 'Could not create the account.')); this.busy.set(false); } });
  }
}
