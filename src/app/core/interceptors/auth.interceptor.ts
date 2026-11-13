import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService), t = auth.token();
  return next(t ? req.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : req).pipe(
    catchError(e => { if (e.status === 401 && !req.url.includes('/auth/')) auth.logout(); return throwError(() => e); }));
};
