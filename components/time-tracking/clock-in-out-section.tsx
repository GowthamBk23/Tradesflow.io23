"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ClockInOutSection() {
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)
  const [selectedSite, setSelectedSite] = useState("")
  const [note, setNote] = useState("")
  const [location, setLocation] = useState<string | null>(null)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  // Format date as Day, Month Date, Year
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Calculate duration between clock in and current time
  const calculateDuration = () => {
    if (!clockInTime) return "00:00:00"

    const diff = Math.floor((currentTime.getTime() - clockInTime.getTime()) / 1000)
    const hours = Math.floor(diff / 3600)
      .toString()
      .padStart(2, "0")
    const minutes = Math.floor((diff % 3600) / 60)
      .toString()
      .padStart(2, "0")
    const seconds = Math.floor(diff % 60)
      .toString()
      .padStart(2, "0")

    return `${hours}:${minutes}:${seconds}`
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

    // Simulate getting GPS location
    const locations = {
      "site-a": "London, Site A (51.5074° N, 0.1278° W)",
      "site-b": "Manchester, Site B (53.4808° N, 2.2426° W)",
      "site-c": "Birmingham, Site C (52.4862° N, 1.8904° W)",
      "site-d": "Edinburgh, Site D (55.9533° N, 3.1883° W)",
    }

    setLocation(locations[selectedSite as keyof typeof locations])
    setClockInTime(new Date())
    setIsClockedIn(true)

    toast({
      title: "Clocked In",
      description: `You have successfully clocked in at ${formatTime(new Date())}`,
    })
  }

  // Handle clock out
  const handleClockOut = () => {
    setIsClockedIn(false)

    toast({
      title: "Clocked Out",
      description: `You have successfully clocked out at ${formatTime(new Date())}. Total time: ${calculateDuration()}`,
    })

    // Reset form
    setClockInTime(null)
    setNote("")
    setLocation(null)
  }

  return (
    <div className="space-y-6">
      {/* Current Time Card */}
      <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Clock className="h-10 w-10 text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-2">{formatTime(currentTime)}</h2>
          <p className="text-muted-foreground">{formatDate(currentTime)}</p>

          {isClockedIn && (
            <div className="mt-4 flex items-center gap-2 text-green-500">
              <CheckCircle className="h-5 w-5" />
              <span>Currently clocked in for {calculateDuration()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clock In/Out Card */}
      <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {isClockedIn ? (
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location captured</p>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Shift Notes (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add any notes about this shift..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <Button
                className="w-full h-14 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={handleClockOut}
              >
                Clock Out
              </Button>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Clock className="h-4 w-4" />
                <span>Clocked in at {clockInTime ? formatTime(clockInTime) : ""}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site">Select Job Site</Label>
                <Select value={selectedSite} onValueChange={setSelectedSite}>
                  <SelectTrigger id="site" className="rounded-xl">
                    <SelectValue placeholder="Select job site" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="site-a">Site A - London Office</SelectItem>
                    <SelectItem value="site-b">Site B - Manchester Residence</SelectItem>
                    <SelectItem value="site-c">Site C - Birmingham Commercial</SelectItem>
                    <SelectItem value="site-d">Site D - Edinburgh Hospital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white"
                onClick={handleClockIn}
              >
                Clock In
              </Button>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>You are currently clocked out</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
