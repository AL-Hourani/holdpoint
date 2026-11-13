export type HoldStatus = 'ACTIVE' | 'RELEASED' | 'EXPIRED';
export interface Hold { id: string; resourceId: string; resourceKey: string; holderName: string; quantity: number; status: HoldStatus; createdAt: string; expiresAt: string; }
export interface CreateHoldRequest { resourceId: string; holderName: string; quantity: number; durationMinutes: number; }
export interface HoldFilter { resourceId?: string; status?: HoldStatus; }
