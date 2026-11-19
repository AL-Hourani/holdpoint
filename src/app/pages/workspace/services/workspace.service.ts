
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  CreateWorkspaceRequest,
  WorkspaceResponse
} from '../models/workspace.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/v1/workspaces';

  create(
    request: CreateWorkspaceRequest
  ): Observable<WorkspaceResponse> {

    return this.http.post<WorkspaceResponse>(
      this.apiUrl,
      request
    );
  }
}
