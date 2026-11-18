
import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

type VerificationState =
  | 'verifying'
  | 'success'
  | 'invalid'
  | 'missing';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  readonly state = signal<VerificationState>('verifying');
  readonly email = signal('');
  readonly resendLoading = signal(false);
  readonly resendMessage = signal('');
  readonly resendError = signal('');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state.set('missing');
      return;
    }

    this.verifyEmail(token);
  }

  private verifyEmail(token: string): void {
    this.state.set('verifying');

    this.http.post(
      '/api/v1/auth/verify-email',
      { token }
    ).subscribe({
      next: () => this.state.set('success'),
      error: (error) => {
        this.state.set('invalid');
        console.error('Email verification failed:', error);
      },
    });
  }

  resendVerification(): void {
    const email = this.email().trim().toLowerCase();

    this.resendMessage.set('');
    this.resendError.set('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.resendError.set('Please enter a valid email address.');
      return;
    }

    this.resendLoading.set(true);

    this.http.post(
      '/api/v1/auth/resend-verification',
      { email }
    ).subscribe({
      next: () => {
        this.resendMessage.set(
          'If an account requires verification, a new email will be sent.'
        );
        this.resendLoading.set(false);
      },
      error: () => {
        this.resendMessage.set(
          'If an account requires verification, a new email will be sent.'
        );
        this.resendLoading.set(false);
      },
    });
  }
}
