
export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  createdBy : string;
  createdAt: string;
}
