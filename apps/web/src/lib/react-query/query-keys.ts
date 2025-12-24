export const queryKeys = {
  patients: {
    all: ['patients'] as const,
    lists: () => [...queryKeys.patients.all, 'list'] as const,
    list: (page: number) => [...queryKeys.patients.lists(), page] as const,
    details: () => [...queryKeys.patients.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.patients.details(), id] as const,
    summaries: () => [...queryKeys.patients.all, 'summary'] as const,
    summary: (id: string) => [...queryKeys.patients.summaries(), id] as const,
  },
  schedules: {
    all: ['schedules'] as const,
    lists: () => [...queryKeys.schedules.all, 'list'] as const,
    byPatient: (patientId: string) =>
      [...queryKeys.schedules.lists(), 'patient', patientId] as const,
    details: () => [...queryKeys.schedules.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.schedules.details(), id] as const,
    byPatientAndId: (patientId: string, scheduleId: string) =>
      [...queryKeys.schedules.byPatient(patientId), scheduleId] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: () => [...queryKeys.users.lists()] as const,
  },
  inviteCodes: {
    all: ['inviteCodes'] as const,
    lists: () => [...queryKeys.inviteCodes.all, 'list'] as const,
    list: () => [...queryKeys.inviteCodes.lists()] as const,
  },
} as const;
