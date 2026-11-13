import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { APP_CONFIG } from '../config';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  readonly token = signal<string | null>(localStorage.getItem('hp_token'));
  readonly email = signal<string | null>(localStorage.getItem('hp_email'));
  readonly name = signal<string | null>(localStorage.getItem('hp_name'));
  readonly isLoggedIn = computed(() => !!this.token());
  login(b: LoginRequest) { return this.http.post<AuthResponse>(`${APP_CONFIG.apiBase}/auth/login`, b).pipe(tap(r => this.save(r))); }
  register(b: RegisterRequest) { return this.http.post<AuthResponse>(`${APP_CONFIG.apiBase}/auth/register`, b).pipe(tap(r => this.save(r))); }
  logout() {
    ['hp_token', 'hp_email', 'hp_name'].forEach(k => localStorage.removeItem(k));
    this.token.set(null); this.email.set(null); this.name.set(null);
    this.router.navigateByUrl('/');
  }
  private save(r: AuthResponse) {
    localStorage.setItem('hp_token', r.token); localStorage.setItem('hp_email', r.email); localStorage.setItem('hp_name', r.name ?? '');
    this.token.set(r.token); this.email.set(r.email); this.name.set(r.name ?? null);
  }
}
