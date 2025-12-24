import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { PatientSchedulesList } from '@/components/patient-schedules-list';

interface PatientSchedulesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientSchedulesPage({
  params,
}: PatientSchedulesPageProps) {
  const { id } = await params;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Patient Schedules"
        text="View and manage vaccination schedules for this patient"
      />
      <PatientSchedulesList patientId={id} />
    </DashboardShell>
  );
}
