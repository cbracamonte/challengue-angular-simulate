export interface QuoteSummary {
  id: string;
  product: string;
  monthlyPremium: number;
  coverageAmount: number;
}

/** Lo que un endpoint REST típico devuelve: el objeto completo, aunque la UI use 4 campos. */
export interface RestQuote extends QuoteSummary {
  internalRiskScore: number;
  underwriterNotes: string;
}
