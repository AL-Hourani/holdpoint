
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../../../core/config';

import {
  CreateWorkspaceRequest,
  WorkspaceResponse
} from '../models/workspace.model';


@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private readonly http = inject(HttpClient);

  create(
    request: CreateWorkspaceRequest
  ): Observable<WorkspaceResponse> {

    return this.http.post<WorkspaceResponse>(
      `${APP_CONFIG.apiBase}/workspaces`,
      request
    );

  }

    getMyWorkspaces(): Observable<WorkspaceResponse[]> {
    return this.http.get<WorkspaceResponse[]>(`${APP_CONFIG.apiBase}/workspaces`);
  }
}
