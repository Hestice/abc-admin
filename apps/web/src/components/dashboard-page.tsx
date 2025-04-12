'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { DataOverview } from '@/components/data-overview';
import { PatientManagement } from '@/components/patient-management';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  console.log(activeTab); //TODO: functionality
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Animal Bite Records Dashboard"
        text="Manage patient records, view statistics, and administer system users."
      />
      <Tabs
        defaultValue="overview"
        className="space-y-4 w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="h-10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        <TabsContent
          value="overview"
          className="space-y-4 w-full overflow-x-hidden"
        >
          <DataOverview />
        </TabsContent>
        <TabsContent
          value="patients"
          className="space-y-4 w-full overflow-x-hidden"
        >
          <PatientManagement />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
