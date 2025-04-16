"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns"

export function ScheduleHeader() {
  const [viewMode, setViewMode] = useState<"admin" | "staff">("admin")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const { toast } = useToast()

  // Get current week string (e.g., "Apr 1 - Apr 7, 2025")
  function getCurrentWeekString(date = new Date()) {
    const start = startOfWeek(date, { weekStartsOn: 1 }) // Start from Monday
    const end = endOfWeek(date, { weekStartsOn: 1 }) // End on Sunday

    const formatDate = (date: Date) => {
      return format(date, "MMM d")
    }

    const formatYear = (date: Date) => {
      return format(date, "yyyy")
    }

    return `${formatDate(start)} - ${formatDate(end)}, ${formatYear(end)}`
  }

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = subWeeks(currentDate, 1)
    setCurrentDate(newDate)

    toast({
      title: "Previous Week",
      description: `Viewing schedule for ${getCurrentWeekString(newDate)}`,
    })
  }

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = addWeeks(currentDate, 1)
    setCurrentDate(newDate)

    toast({
      title: "Next Week",
      description: `Viewing schedule for ${getCurrentWeekString(newDate)}`,
    })
  }

  // Toggle between admin and staff view
  const toggleViewMode = () => {
    const newMode = viewMode === "admin" ? "staff" : "admin"
    setViewMode(newMode)

    toast({
      title: "View Mode Changed",
      description: `Switched to ${newMode === "admin" ? "Admin" : "Staff"} View`,
    })
  }

  // Reset to current week when clicking on the date display
  const resetToCurrentWeek = () => {
    const today = new Date()
    setCurrentDate(today)

    toast({
      title: "Current Week",
      description: "Returned to current week",
    })
  }

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date)

      toast({
        title: "Week Selected",
        description: `Viewing schedule for ${getCurrentWeekString(date)}`,
      })
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">Manage staff schedules across job sites</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Week Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-2xl h-10 w-10" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Week</span>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm cursor-pointer hover:bg-card/80 transition-colors"
                title="Click to select a date"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{getCurrentWeekString(currentDate)}</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <div className="p-2 flex flex-col items-center">
                <CalendarComponent mode="single" selected={currentDate} onSelect={handleDateSelect} initialFocus />
                <Button variant="outline" size="sm" className="mt-2 w-full" onClick={resetToCurrentWeek}>
                  Today
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="icon" className="rounded-2xl h-10 w-10" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Week</span>
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Label
              htmlFor="view-mode"
              className={`text-sm ${viewMode === "admin" ? "font-medium" : ""} cursor-pointer`}
              onClick={() => setViewMode("admin")}
            >
              Admin View
            </Label>
            <Switch id="view-mode" checked={viewMode === "staff"} onCheckedChange={toggleViewMode} />
            <Label
              htmlFor="view-mode"
              className={`text-sm ${viewMode === "staff" ? "font-medium" : ""} cursor-pointer`}
              onClick={() => setViewMode("staff")}
            >
              Staff View
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
