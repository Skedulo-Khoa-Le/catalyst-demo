export enum JobAllocationStatus {
  PendingDispatch = 'Pending Dispatch',
  Dispatched = 'Dispatched',
  Confirmed = 'Confirmed',
  EnRoute = 'En Route',
  CheckedIn = 'Checked In',
  InProgress = 'In Progress',
  Complete = 'Complete',
  Deleted = 'Deleted',
  Declined = 'Declined',
}

export enum JobStatus {
  Queued = 'Queued',
  PendingAllocation = 'Pending Allocation',
  PendingDispatch = 'Pending Dispatch',
  Dispatched = 'Dispatched',
  Ready = 'Ready',
  EnRoute = 'En Route',
  OnSite = 'On Site',
  InProgress = 'In Progress',
  Complete = 'Complete',
  Cancelled = 'Cancelled'
}
