"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutDashboard, CheckCircle2, Clock, Users, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"

export default function HeroSection() {
  const { toast } = useToast()

  const handleStartTrial = () => {
    toast({
      title: "Starting your free trial",
      description: "Taking you to the registration page...",
      duration: 2000,
    })
  }

  const handleLogin = () => {
    toast({
      title: "Redirecting to login",
      description: "Taking you to the authentication page...",
      duration: 2000,
    })
  }

  return (
    <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 lg:sticky lg:top-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Powerful Software for{" "}
              <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                Trade Businesses
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Manage your team, jobs, schedules, clients, invoices, and more — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth" onClick={handleStartTrial}>
                <Button size="lg" className="rounded-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="/auth" onClick={handleLogin}>
                <Button size="lg" variant="outline" className="rounded-xl">
                  Login
                </Button>
              </Link>
            </div>
          </div>

          <article className="relative">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center lg:text-left">
              Here's what you'll see inside TradesFlow
            </h2>

            {/* Browser mockup */}
            <div className="relative mx-auto max-w-2xl transform transition-all duration-500 hover:scale-[1.02] hover:-rotate-1">
              {/* Background glow effect */}
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/20 to-teal-400/20 rounded-3xl blur-2xl opacity-50 transform scale-110"
                aria-hidden="true"
              ></div>

              {/* Browser window */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/40 bg-background">
                {/* Browser header */}
                <div className="bg-muted/80 backdrop-blur-sm p-2 border-b border-border/40 flex items-center">
                  <div className="flex space-x-1.5 ml-1.5" aria-hidden="true">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto flex items-center px-3 py-1 rounded-full bg-background/50 text-xs text-muted-foreground w-2/5">
                    app.tradesflow.com
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="grid grid-cols-12 h-[460px] overflow-hidden">
                  {/* Sidebar */}
                  <div className="hidden md:block md:col-span-3 lg:col-span-2 bg-muted/30 border-r border-border/40 py-3">
                    <div className="flex items-center gap-1.5 px-3 py-1 mb-4">
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded bg-blue-500 text-white font-bold text-xs"
                        aria-hidden="true"
                      >
                        TF
                      </div>
                      <span className="font-semibold text-sm">TradesFlow</span>
                    </div>

                    <nav className="space-y-0.5 px-2" aria-label="Dashboard navigation">
                      {[
                        { name: "Dashboard", icon: LayoutDashboard, active: true },
                        { name: "Tasks", icon: CheckCircle2 },
                        { name: "Projects", icon: FileText },
                        { name: "Schedule", icon: Clock },
                        { name: "Staff", icon: Users },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs ${
                            item.active
                              ? "bg-blue-500/10 text-blue-500 font-medium"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {item.name}
                        </div>
                      ))}
                    </nav>
                  </div>

                  {/* Main content */}
                  <div className="col-span-12 md:col-span-9 lg:col-span-10 p-4 overflow-hidden">
                    {/* Welcome header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold">Welcome back, John!</h3>
                      <p className="text-muted-foreground text-xs">Here's what's happening with your projects today.</p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      {[
                        { title: "Projects in Progress", value: "12", change: "+2 from last month", positive: true },
                        { title: "Tasks Due Today", value: "8", change: "-3 from yesterday", positive: false },
                        { title: "Staff Clocked In", value: "7/9", change: "team members", neutral: true },
                        {
                          title: "Outstanding Invoices",
                          value: "£24,500",
                          change: "+£5,200 from last week",
                          positive: false,
                        },
                      ].map((card, index) => (
                        <Card key={index} className="p-2.5 flex flex-col">
                          <div className="text-muted-foreground text-xs font-medium">{card.title}</div>
                          <div className="text-xl font-bold mt-1">{card.value}</div>
                          <div
                            className={`text-xs mt-1 ${
                              card.neutral ? "text-muted-foreground" : card.positive ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {card.change}
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Project Status and Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <Card className="p-3">
                        <h4 className="text-xs font-semibold mb-3">Project Status</h4>
                        <div className="flex justify-around text-center mb-3">
                          {[
                            { value: "12", label: "Active" },
                            { value: "5", label: "On Hold" },
                            { value: "8", label: "Completed" },
                          ].map((stat, index) => (
                            <div key={index}>
                              <div className="text-lg font-bold">{stat.value}</div>
                              <div className="text-xs text-muted-foreground">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground border-t border-border/40 pt-2 mt-2">
                          Project completion rate is 32% higher than last quarter
                        </div>
                      </Card>

                      <Card className="p-3">
                        <h4 className="text-xs font-semibold mb-3">Recent Activity</h4>
                        <div className="space-y-2.5">
                          {[
                            {
                              title: "Task Completed",
                              desc: "John completed the electrical wiring task",
                              time: "10 minutes ago",
                            },
                            {
                              title: "Invoice Paid",
                              desc: "Client paid invoice #INV-2023-004",
                              time: "2 hours ago",
                            },
                          ].map((activity, index) => (
                            <div
                              key={index}
                              className="flex gap-2 pb-2 border-b border-border/20 last:border-0 last:pb-0"
                            >
                              <div
                                className="w-5 h-5 rounded-full bg-muted flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              ></div>
                              <div>
                                <div className="text-xs font-medium">{activity.title}</div>
                                <div className="text-xs text-muted-foreground">{activity.desc}</div>
                                <div className="text-xs text-muted-foreground/70 mt-0.5">{activity.time}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute top-1/4 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl -z-10"
        aria-hidden="true"
      />
    </section>
  )
}
