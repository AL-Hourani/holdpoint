import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_CONFIG } from '../config';
import { CreateHoldRequest, Hold, HoldFilter } from '../models/hold.model';

// Hold endpoints are assumed (not in the controller you shared). Adjust paths to your backend.
@Injectable({ providedIn: 'root' })
export class HoldService {

  private readonly http = inject(HttpClient);

  private readonly base = `${APP_CONFIG.apiBase}/reservations`;

  list(f: HoldFilter = {}) {

    let params = new HttpParams();

    if (f.resourceId) params = params.set('resourceId', f.resourceId);

    if (f.status) params = params.set('status', f.status);

    return this.http.get<Hold[]>(this.base, { params });
  }

  
  create(request: CreateHoldRequest) { 
    return this.http.post<Hold>(this.base, request); 
  }

  release(id: string) { return this.http.post<Hold>(`${this.base}/${id}/release`, {}); }
}
