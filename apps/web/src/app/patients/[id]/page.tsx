import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import PatientEditForm from '@/components/patient-edit-form';

interface PatientEditPageProps {
  params: {
    id: string;
  };
}

export default function PatientEditPage({ params }: PatientEditPageProps) {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Edit Patient Record"
        text="Update patient information and animal bite details"
      />
      <PatientEditForm patientId={params.id} />
    </DashboardShell>
  );
}
