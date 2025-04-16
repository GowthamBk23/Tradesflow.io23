"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, CheckCircle, Clock, ClipboardList, Package, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Mock data for staff dashboard
const getStaffData = (staffId: string) => {
  // TODO: Replace with actual API call to get staff data
  return {
    name: "John Doe",
    role: "Electrician",
    todaySchedule: {
      site: "Site A - London Office",
      address: "123 Main St, London",
      startTime: "08:00",
      endTime: "17:00",
      isOnSite: true,
    },
    clockStatus: {
      isClockedIn: true,
      clockInTime: "08:05",
      location: "Site A - London Office",
    },
    tasksDueSoon: [
      {
        id: "task-1",
        title: "Install kitchen cabinets",
        dueDate: "2025-04-10",
        priority: "High",
        site: "Site A - London Office",
      },
      {
        id: "task-3",
        title: "Fix bathroom plumbing",
        dueDate: "2025-04-08",
        priority: "High",
        site: "Site A - London Office",
      },
    ],
    recentMaterials: [
      {
        id: "mat-1",
        name: "Electrical Conduit",
        quantity: "100m",
        orderDate: "2025-04-01",
        status: "Delivered",
        site: "Site A - London Office",
      },
      {
        id: "mat-2",
        name: "Junction Boxes",
        quantity: "15 units",
        orderDate: "2025-04-01",
        status: "In Transit",
        site: "Site A - London Office",
      },
    ],
  }
}

interface StaffDashboardProps {
  staffId: string
}

export function StaffDashboard({ staffId }: StaffDashboardProps) {
  const [staffData, setStaffData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = getStaffData(staffId)
      setStaffData(data)
      setIsLoading(false)
    }

    fetchData()
  }, [staffId])

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="h-40"></CardContent>
        </Card>
      </div>
    )
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d MMM yyyy")
  }

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 rounded-xl">
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl">
            Medium
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl">
            Delivered
          </Badge>
        )
      case "In Transit":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-xl">
            In Transit
          </Badge>
        )
      case "Pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="grid gap-6">
      {/* Today's Schedule & Clock Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <CardDescription>
              {format(currentTime, "EEEE, d MMMM yyyy")} • {format(currentTime, "h:mm a")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{staffData.todaySchedule.site}</p>
                <p className="text-sm text-muted-foreground">{staffData.todaySchedule.address}</p>
                <p className="text-sm mt-1">
                  {formatTime(staffData.todaySchedule.startTime)} - {formatTime(staffData.todaySchedule.endTime)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/schedule">
              <Button variant="ghost" size="sm" className="rounded-xl">
                View Full Schedule
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Clock Status</CardTitle>
            <CardDescription>Your current time tracking status</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {staffData.clockStatus.isClockedIn ? (
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-500">Currently Clocked In</p>
                  <p className="text-sm">
                    Since {formatTime(staffData.clockStatus.clockInTime)} at {staffData.clockStatus.location}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-500">Not Clocked In</p>
                  <p className="text-sm">You need to clock in to track your time</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/time-tracking">
              <Button
                variant={staffData.clockStatus.isClockedIn ? "outline" : "default"}
                size="sm"
                className="rounded-xl"
              >
                {staffData.clockStatus.isClockedIn ? "Clock Out" : "Clock In"}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Tasks & Materials */}
      <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Your Work Items</CardTitle>
          <CardDescription>Tasks and materials for your assigned sites</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tasks">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tasks">
                <ClipboardList className="h-4 w-4 mr-2" />
                Tasks Due Soon
              </TabsTrigger>
              <TabsTrigger value="materials">
                <Package className="h-4 w-4 mr-2" />
                Recent Materials
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="mt-4 space-y-4">
              {staffData.tasksDueSoon.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tasks due soon</p>
              ) : (
                staffData.tasksDueSoon.map((task: any) => (
                  <Card key={task.id} className="overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.site}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getPriorityBadge(task.priority)}
                          <span className="text-xs text-muted-foreground">Due: {formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/tasks#${task.id}`}>
                          <Button variant="outline" size="sm" className="rounded-xl">
                            View
                          </Button>
                        </Link>
                        <Button size="sm" className="rounded-xl">
                          Complete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}

              <div className="flex justify-end">
                <Link href="/dashboard/tasks">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    View All Tasks
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="materials" className="mt-4 space-y-4">
              {staffData.recentMaterials.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent materials</p>
              ) : (
                staffData.recentMaterials.map((material: any) => (
                  <Card key={material.id} className="overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-muted-foreground">{material.site}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(material.status)}
                          <span className="text-xs text-muted-foreground">
                            Ordered: {formatDate(material.orderDate)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{material.quantity}</p>
                        <Link href="/dashboard/materials">
                          <Button variant="ghost" size="sm" className="rounded-xl mt-1">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              )}

              <div className="flex justify-end">
                <Link href="/dashboard/materials">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    View All Materials
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Link href="/dashboard/time-tracking">
          <Button variant="outline" className="rounded-2xl">
            <Clock className="mr-2 h-4 w-4" />
            Time Tracking
          </Button>
        </Link>
        <Link href="/dashboard/tasks">
          <Button variant="outline" className="rounded-2xl">
            <ClipboardList className="mr-2 h-4 w-4" />
            My Tasks
          </Button>
        </Link>
        <Link href="/dashboard/chat">
          <Button className="rounded-2xl">Message Team</Button>
        </Link>
      </div>
    </div>
  )
}
