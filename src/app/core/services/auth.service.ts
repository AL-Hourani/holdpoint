import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MeResponse } from '../models/auth.model';
import { catchError, of, switchMap, tap } from 'rxjs';
import {  
  LoginRequest, 
  LoginResponse, 
  RegisterRequest , 
  RegisterResponse , 
  TokenResponse
} from '../models/auth.model';
import { APP_CONFIG } from '../config';
import { appConfig } from '../../app.config';

@Injectable({ providedIn: 'root' })
export class AuthService {


  private readonly http = inject(HttpClient);

  private readonly router = inject(Router);

  private readonly userState = signal<MeResponse | null>(null);

  readonly currentUser = this.userState.asReadonly();


  private readonly tokenState = signal<string | null> (null);

  readonly accessToken = this.tokenState.asReadonly();

  readonly isAuthenticated = computed(
    () =>  this.tokenState() !== null && this.userState() !== null
  );


  private readonly initializedState = signal(false);

  readonly initialized = this.initializedState.asReadonly();




  login(request: LoginRequest) { 
    return this.http.post<TokenResponse>(
      `${APP_CONFIG.apiBase}/auth/login`,
       request,
       {withCredentials : true}
      ).pipe(


      tap(response => {
        this.tokenState.set(response.accessToken);
      }),
      switchMap(() => this.loadCurrentUser()),

      tap(() => {
        this.initializedState.set(true);
        this.router.navigate(['/console/overview']);
      })
      )
  }

  register(request: RegisterRequest) {
     return this.http.post<RegisterResponse>(`${APP_CONFIG.apiBase}/auth/register`, request); }



    refreshAccessToken() {
      return this.http.post<TokenResponse>(
        `${APP_CONFIG.apiBase}/auth/refresh`,
        {},
        {
          withCredentials: true
        }
      ).pipe(
        tap(response => {
          this.tokenState.set(response.accessToken);
        })
      );
    }


    loadCurrentUser() {
      return this.http.get<MeResponse>(
        `${APP_CONFIG.apiBase}/auth/me`
      ).pipe(
        tap(user => {
          this.userState.set(user);
        })
      );
    }



    initialize() {
    this.initializedState.set(false);
    return this.refreshAccessToken().pipe(

      switchMap(() => this.loadCurrentUser()),

      catchError(() => {
        this.tokenState.set(null);
        this.userState.set(null);

        return of(null);
      }),

      tap(() => {
        this.initializedState.set(true);
      })
    );
  }



  logout() {
    return this.http.post(
      `${APP_CONFIG.apiBase}/auth/logout` , {} ,
      {
        withCredentials : true
      }
    ).pipe(
      tap(()=>{
        this.router.navigate(['/'])
      })
    )
  }
 
}
