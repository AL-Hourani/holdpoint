export type HoldStatus =    'HELD' | 'EXPIRED' | 'RELEASED';

export interface Hold { 
    id: string; 
    resourceKey: string; 
    quantity: number; 
    status: HoldStatus; 
    createdAt: string; 
    expiresAt: string; 
}
export interface CreateHoldRequest { resourceId: string; holderName: string; quantity: number; durationMinutes: number; }
export interface HoldFilter { resourceId?: string; status?: HoldStatus; }
