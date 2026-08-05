import { Injectable } from '@angular/core';
import { PolicyIssuanceApi } from '../policy-issuance.api';
import { IssuanceResult } from '../policy-issuance.model';

/**
 * Versión legacy (Angular 14-18): reintento manual recursivo, sin backoff y
 * con un límite hardcodeado. DI por constructor, resultado en campos
 * públicos planos. No editar: referencia de "lo que hay en producción".
 */
@Injectable({ providedIn: 'root' })
export class PolicyIssuanceLegacyService {
  result: IssuanceResult | null = null;
  error = false;

  constructor(private readonly api: PolicyIssuanceApi) {}

  submit(policyId: string, attemptsLeft = 3): void {
    this.api.submit(policyId).subscribe({
      next: (result) => {
        this.result = result;
      },
      error: () => {
        if (attemptsLeft > 1) {
          this.submit(policyId, attemptsLeft - 1); // reintento inmediato, sin backoff
        } else {
          this.error = true;
        }
      },
    });
  }
}
