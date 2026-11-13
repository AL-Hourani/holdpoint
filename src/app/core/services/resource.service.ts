import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../config';
import { CreateResourceRequest, Resource, UpdateResourceCapacityRequest } from '../models/resource.model';

@Injectable({ providedIn: 'root' })
export class ResourceService {
  private readonly http = inject(HttpClient);
  private readonly base = `${APP_CONFIG.apiBase}/resources`;
  list() { return this.http.get<Resource[]>(this.base); } // needs GET /resources on the backend
  create(b: CreateResourceRequest) { return this.http.post<Resource>(this.base, b); }
  getById(id: string) { return this.http.get<Resource>(`${this.base}/${id}`); }
  getByKey(key: string) { return this.http.get<Resource>(`${this.base}/key/${encodeURIComponent(key)}`); }
  updateCapacity(id: string, b: UpdateResourceCapacityRequest) { return this.http.patch<Resource>(`${this.base}/${id}/capacity`, b); }
}
