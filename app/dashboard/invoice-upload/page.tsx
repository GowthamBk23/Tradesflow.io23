import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InvoiceUploadHeader } from "@/components/invoice-upload/invoice-upload-header"
import { InvoiceUploader } from "@/components/invoice-upload/invoice-uploader"
import { RecentUploads } from "@/components/invoice-upload/recent-uploads"

export default function InvoiceUploadPage() {
  return (
    <DashboardShell>
      <DashboardHeader>
        <InvoiceUploadHeader />
      </DashboardHeader>
      <div className="space-y-8">
        <InvoiceUploader />
        <RecentUploads />
      </div>
    </DashboardShell>
  )
}
