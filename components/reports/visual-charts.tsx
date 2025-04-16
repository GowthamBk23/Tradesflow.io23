"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function VisualCharts() {
  const [activeTab, setActiveTab] = useState("time")

  // Mock data for time logged per staff member
  const timeLoggedData = [
    { name: "John", hours: 42 },
    { name: "Sarah", hours: 38 },
    { name: "Mike", hours: 45 },
    { name: "Lisa", hours: 32 },
    { name: "David", hours: 28 },
  ]

  // Mock data for invoices paid vs outstanding
  const invoiceData = [
    { name: "Paid", value: 75000, color: "#10b981" },
    { name: "Outstanding", value: 25000, color: "#f59e0b" },
    { name: "Overdue", value: 12000, color: "#ef4444" },
  ]

  // Mock data for weekly job site productivity
  const productivityData = [
    { name: "Site A", productivity: 92 },
    { name: "Site B", productivity: 85 },
    { name: "Site C", productivity: 78 },
    { name: "Site D", productivity: 88 },
  ]

  // Mock data for task completion trends
  const taskTrendData = [
    { name: "Week 1", completed: 24, assigned: 30 },
    { name: "Week 2", completed: 28, assigned: 32 },
    { name: "Week 3", completed: 26, assigned: 28 },
    { name: "Week 4", completed: 30, assigned: 34 },
    { name: "Week 5", completed: 32, assigned: 35 },
    { name: "Week 6", completed: 35, assigned: 38 },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="time" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px] rounded-xl">
          <TabsTrigger value="time" className="rounded-xl">
            Time
          </TabsTrigger>
          <TabsTrigger value="financial" className="rounded-xl">
            Financial
          </TabsTrigger>
          <TabsTrigger value="performance" className="rounded-xl">
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Time Reports Tab */}
        <TabsContent value="time" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Time Logged Per Staff Member</CardTitle>
                <CardDescription>Hours logged in the selected period</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeLoggedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="hours" name="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Task Completion Trends</CardTitle>
                <CardDescription>Tasks completed vs assigned over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="assigned" name="Assigned" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Reports Tab */}
        <TabsContent value="financial" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Invoices Status</CardTitle>
                <CardDescription>Paid vs outstanding invoices</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoiceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {invoiceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`£${value}`, "Amount"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Revenue by Project Site</CardTitle>
                <CardDescription>Total revenue generated per site</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Site A", revenue: 45000 },
                      { name: "Site B", revenue: 32000 },
                      { name: "Site C", revenue: 28000 },
                      { name: "Site D", revenue: 38000 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      formatter={(value) => [`£${value}`, "Revenue"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="revenue" name="Revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Reports Tab */}
        <TabsContent value="performance" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Job Site Productivity</CardTitle>
                <CardDescription>Productivity score by site (0-100)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Productivity"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar dataKey="productivity" name="Productivity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Tasks completed on time per staff member</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "John", onTime: 90, late: 10 },
                      { name: "Sarah", onTime: 85, late: 15 },
                      { name: "Mike", onTime: 95, late: 5 },
                      { name: "Lisa", onTime: 80, late: 20 },
                      { name: "David", onTime: 88, late: 12 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="onTime" name="On Time %" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" name="Late %" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
