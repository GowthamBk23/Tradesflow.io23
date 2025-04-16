"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clock, MapPin, CheckCircle, AlertCircle, Calendar, Clock3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns"

// Mock data for staff time tracking
const getStaffSchedule = (staffId: string) => {
  return {
    currentSite: {
      name: "Site A - London Office",
      address: "123 Main St, London",
      startTime: "08:00",
      endTime: "17:00",
    },
    clockStatus: {
      isClockedIn: true,
      clockInTime: "08:05",
      location: "Site A - London Office",
    },
    recentLogs: [
      {
        id: "log-1",
        date: "2025-04-07",
        site: "Site A - London Office",
        clockIn: "08:10",
        clockOut: "17:05",
        totalHours: 8.92,
        status: "approved",
      },
      {
        id: "log-2",
        date: "2025-04-06",
        site: "Site A - London Office",
        clockIn: "08:00",
        clockOut: "16:30",
        totalHours: 8.5,
        status: "approved",
      },
      {
        id: "log-3",
        date: "2025-04-05",
        site: "Site C - Birmingham Commercial",
        clockIn: "08:15",
        clockOut: "17:00",
        totalHours: 8.75,
        status: "pending",
      },
    ],
    weeklySchedule: [
      {
        date: "2025-04-07",
        site: "Site A - London Office",
        startTime: "08:00",
        endTime: "17:00",
        isToday: true,
      },
      {
        date: "2025-04-08",
        site: "Site A - London Office",
        startTime: "08:00",
        endTime: "17:00",
      },
      {
        date: "2025-04-09",
        site: "Site A - London Office",
        startTime: "08:00",
        endTime: "17:00",
      },
      {
        date: "2025-04-10",
        site: "Site C - Birmingham Commercial",
        startTime: "08:00",
        endTime: "17:00",
      },
      {
        date: "2025-04-11",
        site: "Site C - Birmingham Commercial",
        startTime: "08:00",
        endTime: "17:00",
      },
    ],
  }
}

interface StaffTimeTrackingProps {
  staffId: string
}

export function StaffTimeTracking({ staffId }: StaffTimeTrackingProps) {
  const [staffData, setStaffData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedSite, setSelectedSite] = useState("")
  const [note, setNote] = useState("")
  const { toast } = useToast()

  // Update current time every minute
  useEffect(() => {
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
      const data = getStaffSchedule(staffId)
      setStaffData(data)
      setSelectedSite(data.currentSite.name)
      setIsLoading(false)
    }

    fetchData()
  }, [staffId])

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-32 bg-muted rounded"></div>
                <div className="h-4 w-48 bg-muted rounded mt-1"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 w-32 bg-muted rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-40 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "EEE, d MMM")
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Handle clock in
  const handleClockIn = () => {
    if (!selectedSite) {
      toast({
        title: "Site Required",
        description: "Please select a job site before clocking in",
        variant: "destructive",
      })
      return
    }

    setStaffData({
      ...staffData,
      clockStatus: {
        isClockedIn: true,
        clockInTime: format(new Date(), "HH:mm"),
        location: selectedSite,
      },
    })

    toast({
      title: "Clocked In",
      description: `You have successfully clocked in at ${format(new Date(), "h:mm a")}`,
    })
  }

  // Handle clock out
  const handleClockOut = () => {
    // Calculate duration
    const [hours, minutes] = staffData.clockStatus.clockInTime.split(":").map(Number)
    const clockInDate = new Date()
    clockInDate.setHours(hours, minutes, 0)

    const durationMs = new Date().getTime() - clockInDate.getTime()
    const durationHours = durationMs / (1000 * 60 * 60)

    // Add to recent logs
    const newLog = {
      id: `log-${Date.now()}`,
      date: format(new Date(), "yyyy-MM-dd"),
      site: staffData.clockStatus.location,
      clockIn: staffData.clockStatus.clockInTime,
      clockOut: format(new Date(), "HH:mm"),
      totalHours: Math.round(durationHours * 100) / 100,
      status: "pending",
    }

    setStaffData({
      ...staffData,
      clockStatus: {
        isClockedIn: false,
        clockInTime: null,
        location: null,
      },
      recentLogs: [newLog, ...staffData.recentLogs],
    })

    toast({
      title: "Clocked Out",
      description: `You have successfully clocked out at ${format(new Date(), "h:mm a")}. Total time: ${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`,
    })

    setNote("")
  }

  // Get current week dates
  const currentWeekStart = startOfWeek(currentTime, { weekStartsOn: 1 }) // Monday
  const currentWeekEnd = endOfWeek(currentTime, { weekStartsOn: 1 }) // Sunday
  const weekDates = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd })

  return (
    <div className="space-y-6">
      {/* Current Time & Clock Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Current Schedule</CardTitle>
            <CardDescription>
              {format(currentTime, "EEEE, d MMMM yyyy")} • {format(currentTime, "h:mm a")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{staffData.currentSite.name}</p>
                <p className="text-sm text-muted-foreground">{staffData.currentSite.address}</p>
                <p className="text-sm mt-1">
                  {formatTime(staffData.currentSite.startTime)} - {formatTime(staffData.currentSite.endTime)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Clock Status</CardTitle>
            <CardDescription>Track your work hours</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {staffData.clockStatus.isClockedIn ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-500">Currently Clocked In</p>
                    <p className="text-sm">
                      Since {formatTime(staffData.clockStatus.clockInTime)} at {staffData.clockStatus.location}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Shift Notes (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add any notes about this shift..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="rounded-xl min-h-[80px]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-500">Not Clocked In</p>
                    <p className="text-sm">You need to clock in to track your time</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site">Select Job Site</Label>
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger id="site" className="rounded-xl">
                      <SelectValue placeholder="Select job site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Site A - London Office">Site A - London Office</SelectItem>
                      <SelectItem value="Site C - Birmingham Commercial">Site C - Birmingham Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full rounded-xl ${
                staffData.clockStatus.isClockedIn
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={staffData.clockStatus.isClockedIn ? handleClockOut : handleClockIn}
            >
              {staffData.clockStatus.isClockedIn ? "Clock Out" : "Clock In"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Weekly Schedule & Recent Logs */}
      <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Time Tracking</CardTitle>
          <CardDescription>Your schedule and recent time logs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="schedule">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="schedule">
                <Calendar className="h-4 w-4 mr-2" />
                Weekly Schedule
              </TabsTrigger>
              <TabsTrigger value="logs">
                <Clock3 className="h-4 w-4 mr-2" />
                Recent Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {staffData.weeklySchedule.map((day: any, index: number) => (
                  <Card
                    key={day.date}
                    className={`overflow-hidden ${isToday(parseISO(day.date)) ? "border-primary" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{formatDate(day.date)}</CardTitle>
                      {isToday(parseISO(day.date)) && (
                        <Badge className="bg-primary text-primary-foreground">Today</Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{day.site}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatTime(day.startTime)} - {formatTime(day.endTime)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="logs" className="mt-4 space-y-4">
              {staffData.recentLogs.map((log: any) => (
                <Card key={log.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{formatDate(log.date)}</CardTitle>
                      {getStatusBadge(log.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{log.site}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{log.totalHours} hours</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">In: {formatTime(log.clockIn)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Out: {formatTime(log.clockOut)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
