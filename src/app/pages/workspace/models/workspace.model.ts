
export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  status :  'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdBy : string;
  createdAt: string;
}
