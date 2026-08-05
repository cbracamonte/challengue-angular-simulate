import { Injectable } from '@angular/core';
import { Observable, interval, map, startWith } from 'rxjs';
import { Policy } from './policy.model';

const BASE_POLICIES: Policy[] = [
  { id: 'POL-1001', holderName: 'Ana Torres', premium: 120, status: 'active' },
  { id: 'POL-1002', holderName: 'Luis Medina', premium: 85, status: 'pending' },
  { id: 'POL-1003', holderName: 'Carla Ruiz', premium: 210, status: 'active' },
  { id: 'POL-1004', holderName: 'Diego Paz', premium: 60, status: 'cancelled' },
];

/**
 * Simula un feed en vivo (ej. websocket/polling) de actualizaciones de prima —
 * un Observable que nunca completa por sí solo. Cualquier suscriptor que se
 * olvide de desuscribirse va a leakear de verdad, no solo en teoría.
 */
@Injectable({ providedIn: 'root' })
export class PolicyService {
  watchPolicies(): Observable<Policy[]> {
    return interval(1000).pipe(
      startWith(-1),
      map((tick) =>
        BASE_POLICIES.map((policy) => ({
          ...policy,
          premium: tick < 0 ? policy.premium : Math.round(policy.premium * (1 + ((tick % 5) - 2) / 100)),
        })),
      ),
    );
  }
}
