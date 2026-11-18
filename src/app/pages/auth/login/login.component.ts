import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { errText } from '../../../core/util';
import { 
  LucideMail , 
  LucideLock , 
  LucideArrowBigRight,
  LucideCircleX
} from '@lucide/angular';

@Component({ 
  selector: 'app-login', 
  standalone : true,
  imports: [ReactiveFormsModule,
     RouterLink,
     LucideMail,
     LucideLock,
     LucideArrowBigRight,
     LucideCircleX
    ], 
  templateUrl: './login.component.html',
  styleUrl : './login.component.css'
 })
export class LoginComponent {
  private readonly auth = inject(AuthService); 
  
  private readonly router = inject(Router);

  readonly busy = signal(false); 
  readonly error = signal('');

  readonly form = inject(FormBuilder).nonNullable.group({ 
    email: ['', [Validators.required, Validators.email]], 
    password: ['', Validators.required] 
  });

  submit() {

    if(this.form.invalid || this.busy() ){
      this.form.markAllAsTouched()
      return;
    }

    this.busy.set(true); 
    this.error.set('');
    
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/console'),
      error: e => { this.error.set(errText(e, 'Could not sign in.')); this.busy.set(false); } });
  }
}
