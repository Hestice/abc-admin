import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { PatientManagement } from '@/components/patient-management';

export default function PatientsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Patient Management"
        text="Manage patient records."
      />
      <PatientManagement />
    </DashboardShell>
  );
}
