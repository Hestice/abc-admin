import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import PatientEditForm from '@/components/patient-edit-form';

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
        heading="Edit Patient Record"
        text="Update patient information and animal bite details"
      />
      <PatientEditForm patientId={id} />
    </DashboardShell>
  );
}
