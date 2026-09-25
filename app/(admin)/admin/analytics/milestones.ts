// Plain module so both the server page and the "use client" PagePerformance
// table can import the real array (a client module would hand the server a
// client reference instead).
export const MILESTONES = [25, 50, 75, 100] as const;
