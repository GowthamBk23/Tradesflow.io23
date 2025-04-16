"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Briefcase, CheckSquare, Users, FileText, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function KpiCards() {
  const router = useRouter()
  const { toast } = useToast()

  // In a real app, you would fetch this data from your API
  // and show different KPIs based on user role
  const userRole = "admin" // This would come from your auth context

  const handleNewProject = () => {
    toast({
      title: "Creating new project",
      description: "Redirecting to projects page...",
    })
    router.push("/dashboard/projects?new=true")
  }

  const handleViewTasks = () => {
    toast({
      title: "Viewing tasks",
      description: "Redirecting to tasks page...",
    })
    router.push("/dashboard/tasks")
  }

  const handleViewStaff = () => {
    toast({
      title: "Viewing staff",
      description: "Redirecting to staff page...",
    })
    router.push("/dashboard/staff")
  }

  const handleViewInvoices = () => {
    toast({
      title: "Viewing invoices",
      description: "Redirecting to invoices page...",
    })
    router.push("/dashboard/invoices")
  }

  // Admin KPIs
  const adminKpis = [
    {
      title: "Projects in Progress",
      value: "12",
      icon: Briefcase,
      trend: { direction: "up", value: "+2", text: "from last month" },
      trendColor: "text-teal-400",
      action: {
        label: "New Project",
        onClick: handleNewProject,
        href: "/dashboard/projects?new=true",
      },
    },
    {
      title: "Tasks Due Today",
      value: "8",
      icon: CheckSquare,
      trend: { direction: "down", value: "-3", text: "from yesterday" },
      trendColor: "text-teal-400",
      action: {
        label: "View Tasks",
        onClick: handleViewTasks,
        href: "/dashboard/tasks",
      },
    },
    {
      title: "Staff Clocked In",
      value: "7/9",
      icon: Users,
      trend: { direction: "none", value: "", text: "team members" },
      trendColor: "",
      action: {
        label: "View Staff",
        onClick: handleViewStaff,
        href: "/dashboard/staff",
      },
    },
    {
      title: "Outstanding Invoices",
      value: "£24,500",
      icon: FileText,
      trend: { direction: "up", value: "+£5,200", text: "from last week" },
      trendColor: "text-rose-500",
      action: {
        label: "View Invoices",
        onClick: handleViewInvoices,
        href: "/dashboard/invoices",
      },
    },
  ]

  // Select KPIs based on user role
  const kpis = adminKpis

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {kpi.trend.direction !== "none" && (
                <>
                  {kpi.trend.direction === "up" ? (
                    <TrendingUp className={`mr-1 h-3 w-3 ${kpi.trendColor}`} />
                  ) : (
                    <TrendingDown className={`mr-1 h-3 w-3 ${kpi.trendColor}`} />
                  )}
                  <span className={kpi.trendColor + " font-medium"}>{kpi.trend.value}</span>
                  <span className="ml-1">{kpi.trend.text}</span>
                </>
              )}
              {kpi.trend.direction === "none" && <span>{kpi.trend.text}</span>}
            </div>
          </CardContent>
          <CardFooter className="p-2">
            <Link href={kpi.action.href} className="w-full">
              <Button variant="ghost" className="w-full justify-between rounded-xl" onClick={kpi.action.onClick}>
                {kpi.action.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
