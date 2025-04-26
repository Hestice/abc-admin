import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { VaccinationSchedule } from '@/components/vaccination-schedule';
interface PatientEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientEditPage({
  params,
}: PatientEditPageProps) {
  const { id } = await params;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Vaccination Schedule"
        text="Update patient vaccinations and other schedule details"
      />
      <VaccinationSchedule patientId={id} />
    </DashboardShell>
  );
}
