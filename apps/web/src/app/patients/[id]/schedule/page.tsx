import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import PatientScheduleForm from '@/components/patient-schedule-form';
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
      <PatientScheduleForm patientId={id} />
    </DashboardShell>
  );
}
