import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';

import { 
  provideLucideIcons, 
  LucideArrowLeft,
  LucideAlarmClock ,
  LucideArrowRight,
  LucideBlocks,
  LucideMail,
  LucideLock,
  LucideArrowBigRight,
  LucideCircleX,
  LucideUserRound,
  LucidePanelLeft,
  LucideSearch,
  LucidePlus,
  LucideLogOut,
  LucideLayersPlus,
  LucideChevronRight,
  LucidePackagePlus,
  
  
} from '@lucide/angular';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(()=>
      inject(AuthService).initialize()
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideLucideIcons(
      LucideArrowLeft,
      LucideAlarmClock,
      LucideArrowRight,
      LucideMail,
      LucideLock,
      LucideArrowBigRight,
      LucideCircleX,
      LucideUserRound,
      LucidePanelLeft,
      LucideSearch,
      LucidePlus,
      LucideLogOut,
      LucideLayersPlus,
      LucideLayersPlus,
      LucideChevronRight,
      LucidePackagePlus,
      LucideBlocks
    ),
  ],
};
