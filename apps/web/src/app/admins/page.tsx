import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AdminManagement } from "@/components/admin-management"

export default function AdminPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Admin Management" text="Manage administrator accounts and permissions." />
      <AdminManagement />
    </DashboardShell>
  )
}
