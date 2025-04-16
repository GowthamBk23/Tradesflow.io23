"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, FileText, CreditCard, Briefcase, AlertTriangle } from "lucide-react"

export function KpiSummary() {
  // Mock data for KPIs
  const kpis = [
    {
      title: "Total Hours Logged",
      value: "1,248",
      change: "+12%",
      trend: "up",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Invoices Issued",
      value: "£124,500",
      change: "+8%",
      trend: "up",
      icon: FileText,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
    {
      title: "Total Paid",
      value: "£98,750",
      change: "+15%",
      trend: "up",
      icon: CreditCard,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Ongoing Projects",
      value: "8",
      change: "0",
      trend: "neutral",
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Unapproved Hours",
      value: "24",
      change: "-10%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi, index) => (
        <Card key={index} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${kpi.bgColor}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div
                className={`text-xs font-medium ${
                  kpi.trend === "up"
                    ? "text-green-500"
                    : kpi.trend === "down"
                      ? "text-rose-500"
                      : "text-muted-foreground"
                }`}
              >
                {kpi.change}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{kpi.value}</div>
            <div className="text-sm text-muted-foreground">{kpi.title}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
