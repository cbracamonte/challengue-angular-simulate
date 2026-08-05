export interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved';
}

export interface IncidentsState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

export const initialIncidentsState: IncidentsState = {
  incidents: [],
  loading: false,
  error: null,
};
