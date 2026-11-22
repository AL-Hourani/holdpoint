
import { Injectable, inject, signal } from '@angular/core';
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
  readonly workspaces = signal<WorkspaceResponse[]>([
    {
      id: "dhdhhd-3yehheh-jjejjeh",
      name: "Acme Tecj",
      slug: "./ahourni",
      status :  'ACTIVE',
      createdBy : "",
      createdAt: "",
    }
  ]);
  readonly currentId = signal<string>(localStorage.getItem('workspaceId') ?? '');

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


  select(id: string): void {
    this.currentId.set(id);
    localStorage.setItem('workspaceId', id);
  }
}
