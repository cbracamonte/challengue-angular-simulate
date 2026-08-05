export interface Incident {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  assigneeId: string;
  status: 'open' | 'resolved';
}

export interface IncidentWithAssignee extends Incident {
  assigneeName: string;
}
