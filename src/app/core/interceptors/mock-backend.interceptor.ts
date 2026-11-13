import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map, mergeMap, throwError, timer } from 'rxjs';
import { APP_CONFIG } from '../config';
import { Hold } from '../models/hold.model';
import { Resource } from '../models/resource.model';

/** In-memory backend that mimics the Spring API (consistency rules included). Persisted in localStorage. */
interface Db { resources: Resource[]; holds: Hold[]; users: { name: string; email: string; password: string }[]; }
const KEY = 'holdora_mock_db';
const mins = (m: number) => new Date(Date.now() + m * 60000).toISOString();
const rid = (n: number) => `00000000-0000-4000-8000-00000000000${n}`;
const seed = (): Db => {
  const R = [['conference-room-a', 'Conference Room A', 12], ['gpu-cluster-01', 'GPU Cluster 01', 8], ['license-pool-pro', 'Pro License Pool', 50], ['loading-dock-3', 'Loading Dock 3', 4], ['test-devices', 'Test Devices', 20]] as const;
  const resources: Resource[] = R.map(([resourceKey, name, capacity], i) => ({ id: rid(i + 1), resourceKey, name, capacity, createdAt: mins(-(i + 2) * 1440) }));
  const H = (n: number, r: number, who: string, q: number, st: Hold['status'], c: number, e: number): Hold =>
    ({ id: crypto.randomUUID(), resourceId: rid(r), resourceKey: R[r - 1][0], holderName: who, quantity: q, status: st, createdAt: mins(c), expiresAt: mins(e) });
  return { resources, users: [{ name: 'Demo User', email: 'demo@holdora.dev', password: 'demo1234' }], holds: [
    H(1, 1, 'Design team', 12, 'ACTIVE', -30, 90), H(2, 2, 'ML research', 6, 'ACTIVE', -120, 600), H(3, 3, 'Sales onboarding', 35, 'ACTIVE', -300, 1200),
    H(4, 4, 'Logistics', 2, 'ACTIVE', -45, 15), H(5, 5, 'QA sprint', 8, 'RELEASED', -2000, -1000), H(6, 2, 'Data eng', 2, 'EXPIRED', -3000, -2500)] };
};
let db: Db = JSON.parse(localStorage.getItem(KEY) ?? 'null') ?? seed();
const save = () => localStorage.setItem(KEY, JSON.stringify(db));
const view = (h: Hold): Hold => ({ ...h, status: h.status === 'ACTIVE' && new Date(h.expiresAt) <= new Date() ? 'EXPIRED' : h.status });
const heldOf = (id: string) => db.holds.map(view).filter(h => h.resourceId === id && h.status === 'ACTIVE').reduce((s, h) => s + h.quantity, 0);
const res = (r: Resource): Resource => ({ ...r, heldQuantity: heldOf(r.id) });

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(APP_CONFIG.apiBase)) return next(req);
  const path = req.url.slice(APP_CONFIG.apiBase.length), method = req.method, b: any = req.body ?? {};
  const ok = (body: unknown, status = 200) => timer(250).pipe(map(() => new HttpResponse({ status, body })));
  const fail = (status: number, message: string) => timer(250).pipe(mergeMap(() => throwError(() => new HttpErrorResponse({ status, error: { message }, url: req.url }))));
  let m: RegExpExecArray | null;

  if (method === 'POST' && path === '/auth/login') {
    const u = db.users.find(x => x.email.toLowerCase() === String(b.email).toLowerCase() && x.password === b.password);
    return u ? ok({ token: 'mock.' + crypto.randomUUID(), email: u.email, name: u.name }) : fail(401, 'Wrong email or password.');
  }
  if (method === 'POST' && path === '/auth/register') {
    if (db.users.some(x => x.email.toLowerCase() === String(b.email).toLowerCase())) return fail(409, 'An account with this email already exists.');
    db.users.push({ name: b.name, email: b.email, password: b.password }); save();
    return ok({ token: 'mock.' + crypto.randomUUID(), email: b.email, name: b.name }, 201);
  }
  if (method === 'GET' && path === '/resources') return ok(db.resources.map(res));
  if (method === 'POST' && path === '/resources') {
    if (db.resources.some(r => r.resourceKey === b.resourceKey)) return fail(409, `Resource key "${b.resourceKey}" already exists.`);
    if (!(b.capacity >= 1)) return fail(400, 'Capacity must be at least 1.');
    const r: Resource = { id: crypto.randomUUID(), resourceKey: b.resourceKey, name: b.name, capacity: b.capacity, createdAt: new Date().toISOString() };
    db.resources.push(r); save(); return ok(res(r), 201);
  }
  if (method === 'GET' && (m = /^\/resources\/key\/(.+)$/.exec(path))) {
    const r = db.resources.find(x => x.resourceKey === decodeURIComponent(m![1])); return r ? ok(res(r)) : fail(404, 'Resource not found.');
  }
  if (method === 'GET' && (m = /^\/resources\/([^/]+)$/.exec(path))) {
    const r = db.resources.find(x => x.id === m![1]); return r ? ok(res(r)) : fail(404, 'Resource not found.');
  }
  if (method === 'PATCH' && (m = /^\/resources\/([^/]+)\/capacity$/.exec(path))) {
    const r = db.resources.find(x => x.id === m![1]); if (!r) return fail(404, 'Resource not found.');
    if (!(b.capacity >= 1)) return fail(400, 'Capacity must be at least 1.');
    const h = heldOf(r.id); if (b.capacity < h) return fail(409, `Capacity cannot be lower than active holds (${h}).`);
    r.capacity = b.capacity; save(); return ok(res(r));
  }
  if (method === 'GET' && path === '/holds') {
    const rId = req.params.get('resourceId'), st = req.params.get('status');
    return ok(db.holds.map(view).filter(h => (!rId || h.resourceId === rId) && (!st || h.status === st)).sort((a, c) => c.createdAt.localeCompare(a.createdAt)));
  }
  if (method === 'POST' && path === '/holds') {
    const r = db.resources.find(x => x.id === b.resourceId); if (!r) return fail(404, 'Resource not found.');
    const avail = r.capacity - heldOf(r.id);
    if (b.quantity > avail) return fail(409, `Only ${avail} of ${r.capacity} units are available on ${r.resourceKey}.`);
    const h: Hold = { id: crypto.randomUUID(), resourceId: r.id, resourceKey: r.resourceKey, holderName: b.holderName, quantity: b.quantity, status: 'ACTIVE', createdAt: new Date().toISOString(), expiresAt: mins(b.durationMinutes) };
    db.holds.push(h); save(); return ok(h, 201);
  }
  if (method === 'POST' && (m = /^\/holds\/([^/]+)\/release$/.exec(path))) {
    const h = db.holds.find(x => x.id === m![1]); if (!h) return fail(404, 'Hold not found.');
    if (view(h).status !== 'ACTIVE') return fail(409, 'Only active holds can be released.');
    h.status = 'RELEASED'; save(); return ok(h);
  }
  return fail(404, 'Not found.');
};
