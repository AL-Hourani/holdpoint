// Align with your Java DTOs. heldQuantity is expected on list/detail responses.
export interface Resource { 
    id: string; 
    resourceKey:  string;
    name:  string;
    capacity: number;
    reservedQuantity : number;
    confirmedQuantity : number;
    createdAt?: string;
 }
export interface CreateResourceRequest {  
    name: string; 
    resourceKey: string; 
    capacity: number; 
}


export interface UpdateResourceCapacityRequest { capacity: number; }
