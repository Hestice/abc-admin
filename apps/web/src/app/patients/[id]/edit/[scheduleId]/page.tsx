import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { VaccinationSchedule } from '@/components/vaccination-schedule';

interface PatientScheduleEditPageProps {
  params: Promise<{
    id: string;
    scheduleId: string;
  }>;
}

export default async function PatientScheduleEditPage({
  params,
}: PatientScheduleEditPageProps) {
  const { id, scheduleId } = await params;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Vaccination Schedule"
        text="Update patient vaccinations and other schedule details"
      />
      <VaccinationSchedule patientId={id} scheduleId={scheduleId} />
    </DashboardShell>
  );
}
