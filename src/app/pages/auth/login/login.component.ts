import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { APP_CONFIG } from '../../../core/config';
import { errText } from '../../../core/util';

@Component({ selector: 'app-login', imports: [ReactiveFormsModule, RouterLink], templateUrl: './login.component.html' })
export class LoginComponent {
  private readonly auth = inject(AuthService); private readonly router = inject(Router);
  readonly mock = APP_CONFIG.useMock; readonly busy = signal(false); readonly error = signal('');
  readonly form = inject(FormBuilder).nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  submit() {
    this.busy.set(true); this.error.set('');
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/console'),
      error: e => { this.error.set(errText(e, 'Could not sign in.')); this.busy.set(false); } });
  }
}
