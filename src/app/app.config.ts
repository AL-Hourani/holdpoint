import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { APP_CONFIG } from './core/config';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { mockBackendInterceptor } from './core/interceptors/mock-backend.interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, ...(APP_CONFIG.useMock ? [mockBackendInterceptor] : [])])),
  ],
};
