import { Hold } from './models/hold.model';
import { Resource } from './models/resource.model';
export const held = (r: Resource) => r.heldQuantity ?? 0;
export const available = (r: Resource) => Math.max(0, r.capacity - held(r));
export const util = (r: Resource) => (r.capacity ? Math.round((held(r) / r.capacity) * 100) : 0);
export const barClass = (p: number) => (p >= 100 ? 'bar full' : p >= 80 ? 'bar warn' : 'bar');
export const holdChip = (h: Hold) => ({ ACTIVE: 'chip ok', RELEASED: 'chip', EXPIRED: 'chip warn' })[h.status];
export const errText = (e: any, fallback = 'Something went wrong. Please try again.') => e?.error?.message ?? fallback;
