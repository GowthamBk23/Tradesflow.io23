"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, BarChart2, Users, Calendar, ClipboardList, Briefcase, FileText } from "lucide-react"

// Mock data for different pages
const mockData = {
  dashboard: {
    kpis: [
      { title: "Projects in Progress", value: "12", change: "+2 from last month", positive: true },
      { title: "Tasks Due Today", value: "8", change: "-3 from yesterday", positive: false },
      { title: "Staff Clocked In", value: "7/9", change: "team members", neutral: true },
      { title: "Outstanding Invoices", value: "£24,500", change: "+£5,200 from last week", positive: false },
    ],
    projectStatus: { active: 12, onHold: 5, completed: 8 },
    recentActivity: [
      {
        title: "Task Completed",
        description: "John completed the electrical wiring task",
        time: "10 minutes ago",
      },
      {
        title: "Invoice Paid",
        description: "Client paid invoice #INV-2023-004",
        time: "2 hours ago",
      },
    ],
  },
  tasks: {
    columns: [
      {
        title: "To Do",
        count: 5,
        tasks: [
          { title: "Install new electrical panel", priority: "high" },
          { title: "Order materials for bathroom remodel", priority: "medium" },
        ],
      },
      {
        title: "In Progress",
        count: 3,
        tasks: [
          { title: "Kitchen cabinet installation", priority: "high" },
          { title: "Plumbing inspection", priority: "medium" },
        ],
      },
      {
        title: "Completed",
        count: 8,
        tasks: [
          { title: "Drywall repair in living room", priority: "medium" },
          { title: "Paint bedroom walls", priority: "low" },
        ],
      },
    ],
  },
  projects: {
    projects: [
      { name: "Smith Residence Renovation", status: "In Progress", completion: 65 },
      { name: "Johnson Kitchen Remodel", status: "On Hold", completion: 30 },
      { name: "Commercial Office Buildout", status: "In Progress", completion: 45 },
    ],
  },
  schedule: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    shifts: [
      { day: "Monday", staff: "Mike", project: "Smith Residence", time: "8am-4pm" },
      { day: "Monday", staff: "Sarah", project: "Johnson Kitchen", time: "9am-5pm" },
      { day: "Tuesday", staff: "John", project: "Commercial Office", time: "8am-4pm" },
      { day: "Wednesday", staff: "Mike", project: "Smith Residence", time: "8am-4pm" },
      { day: "Friday", staff: "Sarah", project: "Johnson Kitchen", time: "9am-5pm" },
    ],
  },
  staff: {
    members: [
      { name: "John Smith", role: "Electrician", status: "Active" },
      { name: "Sarah Johnson", role: "Plumber", status: "Active" },
      { name: "Mike Williams", role: "Carpenter", status: "On Leave" },
    ],
  },
  clients: {
    list: [
      { name: "Robert Smith", projects: 2, invoices: 3 },
      { name: "Jennifer Johnson", projects: 1, invoices: 2 },
      { name: "Michael Brown", projects: 3, invoices: 5 },
    ],
  },
  invoices: {
    list: [
      { number: "INV-2023-001", client: "Robert Smith", amount: "£3,500", status: "Paid" },
      { number: "INV-2023-002", client: "Jennifer Johnson", amount: "£2,800", status: "Pending" },
      { number: "INV-2023-003", client: "Michael Brown", amount: "£5,200", status: "Overdue" },
    ],
  },
}

export function DashboardPreview() {
  const [activePage, setActivePage] = useState("dashboard")

  // For debugging
  console.log("Current active page:", activePage)

  // Navigation items
  const navItems = [
    { name: "Dashboard", value: "dashboard", icon: BarChart2 },
    { name: "Tasks", value: "tasks", icon: ClipboardList },
    { name: "Projects", value: "projects", icon: Briefcase },
    { name: "Schedule", value: "schedule", icon: Calendar },
    { name: "Staff", value: "staff", icon: Users },
    { name: "Clients", value: "clients", icon: Users },
    { name: "Invoices", value: "invoices", icon: FileText },
  ]

  // Render content based on active page
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <>
            {/* Welcome header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Welcome back, John!</h1>
              <p className="text-muted-foreground">Here's what's happening with your projects today.</p>

              <div className="flex gap-3 mt-4">
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Task
                </Button>
                <Button size="sm" variant="outline" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {mockData.dashboard.kpis.map((kpi, index) => (
                <Card key={index} className="p-4">
                  <div className="text-muted-foreground text-sm font-medium">{kpi.title}</div>
                  <div className="text-3xl font-bold mt-1">{kpi.value}</div>
                  <div
                    className={`text-xs mt-1 ${
                      kpi.positive ? "text-green-500" : kpi.neutral ? "text-muted-foreground" : "text-red-500"
                    }`}
                  >
                    {kpi.change}
                  </div>
                </Card>
              ))}
            </div>

            {/* Project Status and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Project Status</h2>
                <div className="flex justify-around text-center mb-6">
                  <div>
                    <div className="text-3xl font-bold">{mockData.dashboard.projectStatus.active}</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{mockData.dashboard.projectStatus.onHold}</div>
                    <div className="text-sm text-muted-foreground">On Hold</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{mockData.dashboard.projectStatus.completed}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Project completion rate is 32% higher than last quarter
                </div>
              </Card>

              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {mockData.dashboard.recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted"></div>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )

      case "tasks":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Tasks Board</h1>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Manage and track your team's tasks</p>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockData.tasks.columns.map((column, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{column.title}</h3>
                    <div className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                      {column.count}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {column.tasks.map((task, taskIndex) => (
                      <Card key={taskIndex} className="p-3 shadow-sm">
                        <div className="font-medium text-sm">{task.title}</div>
                        <div className="flex items-center mt-2">
                          <div
                            className={`text-xs rounded-full px-2 py-0.5 ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : task.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {task.priority}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )

      case "projects":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Projects</h1>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Manage and track all your projects</p>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Project
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {mockData.projects.projects.map((project, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{project.name}</h3>
                    <div
                      className={`text-xs rounded-full px-2 py-0.5 ${
                        project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "On Hold"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {project.status}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.completion}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${project.completion}%` }}></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )

      case "schedule":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Schedule</h1>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Manage your team's work schedule</p>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Shift
                </Button>
              </div>
            </div>

            <Card className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {mockData.schedule.days.map((day, index) => (
                  <div key={index} className="text-center font-semibold p-2 bg-muted rounded-md">
                    {day}
                  </div>
                ))}

                {mockData.schedule.days.map((day) => (
                  <div key={day} className="space-y-2">
                    {mockData.schedule.shifts
                      .filter((shift) => shift.day === day)
                      .map((shift, shiftIndex) => (
                        <Card key={shiftIndex} className="p-2 text-xs">
                          <div className="font-semibold">{shift.staff}</div>
                          <div className="text-muted-foreground">{shift.project}</div>
                          <div className="mt-1 text-blue-600">{shift.time}</div>
                        </Card>
                      ))}
                  </div>
                ))}
              </div>
            </Card>
          </>
        )

      case "staff":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Staff</h1>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Manage your team members</p>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Staff
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="grid grid-cols-3 font-semibold p-3 bg-muted text-sm">
                <div>Name</div>
                <div>Role</div>
                <div>Status</div>
              </div>
              {mockData.staff.members.map((member, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 p-3 text-sm border-t border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div>{member.name}</div>
                  <div>{member.role}</div>
                  <div className={`${member.status === "Active" ? "text-green-600" : "text-yellow-600"}`}>
                    {member.status}
                  </div>
                </div>
              ))}
            </Card>
          </>
        )

      case "clients":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Clients</h1>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Manage your client relationships</p>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Client
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="grid grid-cols-3 font-semibold p-3 bg-muted text-sm">
                <div>Name</div>
                <div>Projects</div>
                <div>Invoices</div>
              </div>
              {mockData.clients.list.map((client, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 p-3 text-sm border-t border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div>{client.name}</div>
                  <div>{client.projects}</div>
                  <div>{client.invoices}</div>
                </div>
              ))}
            </Card>
          </>
        )

      case "invoices":
        return (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Invoices</h1>
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">Manage your invoices and payments</p>
                <Button size="sm" className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Create Invoice
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="grid grid-cols-4 font-semibold p-3 bg-muted text-sm">
                <div>Invoice #</div>
                <div>Client</div>
                <div>Amount</div>
                <div>Status</div>
              </div>
              {mockData.invoices.list.map((invoice, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 p-3 text-sm border-t border-border/40 hover:bg-muted/50 transition-colors"
                >
                  <div>{invoice.number}</div>
                  <div>{invoice.client}</div>
                  <div>{invoice.amount}</div>
                  <div
                    className={`${
                      invoice.status === "Paid"
                        ? "text-green-600"
                        : invoice.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {invoice.status}
                  </div>
                </div>
              ))}
            </Card>
          </>
        )

      default:
        return <div>Select a page from the sidebar</div>
    }
  }

  return (
    <section className="w-full py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Here's what you'll see inside TradesFlow</h2>

        {/* Browser mockup */}
        <div className="relative mx-auto max-w-6xl transform transition-all duration-500 hover:scale-[1.01] hover:-rotate-1">
          {/* Background glow effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-teal-400/20 rounded-3xl blur-2xl opacity-50 transform scale-110"></div>

          {/* Browser window */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/40 bg-background">
            {/* Browser header */}
            <div className="bg-muted/80 backdrop-blur-sm p-3 border-b border-border/40 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto flex items-center px-4 py-1 rounded-full bg-background/50 text-xs text-muted-foreground w-1/2">
                app.tradesflow.com/{activePage}
              </div>
            </div>

            {/* Dashboard content */}
            <div className="grid grid-cols-12 h-[600px] md:h-[700px] overflow-hidden">
              {/* Sidebar */}
              <div className="hidden md:block md:col-span-2 lg:col-span-2 bg-muted/50 border-r border-border/40 p-4">
                <div className="flex items-center gap-2 px-2 py-1.5 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 text-white font-bold">
                    TF
                  </div>
                  <span className="font-semibold">TradesFlow</span>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setActivePage(item.value)}
                      className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-md text-sm ${
                        activePage === item.value
                          ? "bg-blue-500/10 text-blue-500 font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Main content */}
              <div className="col-span-12 md:col-span-10 lg:col-span-10 p-6 overflow-auto">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
