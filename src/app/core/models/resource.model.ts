// Align with your Java DTOs. heldQuantity is expected on list/detail responses.
export interface Resource { id: string; resourceKey: string; name: string; capacity: number; heldQuantity?: number; createdAt?: string; }
export interface CreateResourceRequest { resourceKey: string; name: string; capacity: number; }
export interface UpdateResourceCapacityRequest { capacity: number; }
