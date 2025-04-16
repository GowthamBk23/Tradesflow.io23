"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart2, Users, Calendar, ClipboardList, Briefcase, FileText } from "lucide-react"

export function DashboardPreviewSimple() {
  const [activePage, setActivePage] = useState("dashboard")

  console.log("Active page:", activePage)

  // Navigation items
  const navItems = [
    { name: "Dashboard", value: "dashboard", icon: BarChart2 },
    { name: "Tasks", value: "tasks", icon: ClipboardList },
    { name: "Projects", value: "projects", icon: Briefcase },
    { name: "Schedule", value: "schedule", icon: Calendar },
    { name: "Staff", value: "staff", icon: Users },
    { name: "Invoices", value: "invoices", icon: FileText },
  ]

  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Interactive Preview</h2>

        <Card className="p-6 max-w-3xl mx-auto">
          <div className="flex space-x-4 mb-6">
            {navItems.map((item) => (
              <Button
                key={item.value}
                variant={activePage === item.value ? "default" : "outline"}
                onClick={() => setActivePage(item.value)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>

          <div className="p-4 bg-muted rounded-lg min-h-[200px]">
            <h3 className="text-xl font-bold mb-4">{navItems.find((item) => item.value === activePage)?.name} Page</h3>
            <p>You are viewing the {activePage} page content.</p>
          </div>
        </Card>
      </div>
    </section>
  )
}
