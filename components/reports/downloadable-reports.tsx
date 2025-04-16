"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Clock, Briefcase, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DownloadableReports() {
  const { toast } = useToast()

  // Mock data for downloadable reports
  const reports = [
    {
      id: "report-1",
      title: "Payroll Report",
      description: "Staff hours and payment calculations",
      dateRange: "Last 30 days",
      icon: CreditCard,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      formats: ["pdf", "csv"],
    },
    {
      id: "report-2",
      title: "Weekly Staff Logs",
      description: "Detailed time entries by staff member",
      dateRange: "Last 7 days",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      formats: ["pdf", "csv"],
    },
    {
      id: "report-3",
      title: "Project Summaries",
      description: "Progress, hours, and costs by project",
      dateRange: "Last 30 days",
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      formats: ["pdf"],
    },
    {
      id: "report-4",
      title: "Invoice Report",
      description: "All invoices with payment status",
      dateRange: "Last 30 days",
      icon: FileText,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
      formats: ["pdf", "csv"],
    },
  ]

  // Handle download report
  const handleDownload = (report: any, format: string) => {
    toast({
      title: `Downloading ${report.title}`,
      description: `Your ${format.toUpperCase()} report is being generated and will download shortly.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Downloadable Reports</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <Card key={report.id} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl ${report.bgColor}`}>
                  <report.icon className={`h-5 w-5 ${report.color}`} />
                </div>
                <Badge variant="outline" className="rounded-xl">
                  {report.dateRange}
                </Badge>
              </div>
              <CardTitle className="mt-4">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground">
                Available formats: {report.formats.map((format) => format.toUpperCase()).join(", ")}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              {report.formats.includes("pdf") && (
                <Button variant="outline" className="rounded-xl flex-1" onClick={() => handleDownload(report, "pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              )}
              {report.formats.includes("csv") && (
                <Button variant="outline" className="rounded-xl flex-1" onClick={() => handleDownload(report, "csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
