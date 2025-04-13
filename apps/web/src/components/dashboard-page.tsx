'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardShell } from '@/components/dashboard-shell';
import { DataOverview } from '@/components/data-overview';
import { PatientManagement } from '@/components/patient-management';

enum TabType {
  Overview = 'overview',
  Patients = 'patients',
}

export default function DashboardPage() {
  const [_activeTab, setActiveTab] = useState(TabType.Overview);
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Animal Bite Records Dashboard"
        text="Manage patient records, view statistics, and administer system users."
      />
      <Tabs
        defaultValue={TabType.Overview}
        className="space-y-4 w-full"
        onValueChange={(value) => setActiveTab(value as TabType)}
      >
        <TabsList className="h-10">
          <TabsTrigger value={TabType.Overview}>Overview</TabsTrigger>
          <TabsTrigger value={TabType.Patients}>Patients</TabsTrigger>
        </TabsList>
        <TabsContent
          value={TabType.Overview}
          className="space-y-4 w-full overflow-x-hidden"
        >
          <DataOverview />
        </TabsContent>
        <TabsContent
          value={TabType.Patients}
          className="space-y-4 w-full overflow-x-hidden"
        >
          <PatientManagement />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
