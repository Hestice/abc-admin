import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { CreateExposureForm } from '@/components/create-exposure/create-exposure-form';

interface CreateExposurePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreateExposurePage({
  params,
}: CreateExposurePageProps) {
  const { id } = await params;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create New Exposure & Schedule"
        text="Enter exposure information to create a new vaccination schedule for this patient."
      />
      <CreateExposureForm patientId={id} />
    </DashboardShell>
  );
}
