import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IssuanceResult } from './policy-issuance.model';

/** Simula el endpoint de emisión de pólizas (en producción, inestable bajo carga). */
@Injectable({ providedIn: 'root' })
export class PolicyIssuanceApi {
  submit(policyId: string): Observable<IssuanceResult> {
    return of({ policyId, status: 'issued' });
  }
}
