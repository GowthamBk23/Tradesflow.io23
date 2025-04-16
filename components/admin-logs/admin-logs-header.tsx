"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLogsHeader() {
  const { toast } = useToast()

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your CSV file is being generated and will download shortly.",
    })

    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "admin-logs-export.csv has been downloaded.",
        variant: "success",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Logs</h1>
        <p className="text-sm text-muted-foreground">View and monitor all user actions across the platform</p>
      </div>
      <Button variant="outline" size="sm" className="mt-2 sm:mt-0" onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  )
}
