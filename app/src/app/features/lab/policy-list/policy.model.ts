export interface Policy {
  id: string;
  holderName: string;
  premium: number;
  status: 'active' | 'pending' | 'cancelled';
}
