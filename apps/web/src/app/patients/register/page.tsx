import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { PatientRegistrationForm } from '@/components/patient-registration';

export default function Index() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Register Patient"
        text="Enter the patient's details to register them in the system."
      />
      <PatientRegistrationForm />
    </DashboardShell>
  );
}
