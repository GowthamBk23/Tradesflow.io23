"use client"

import { cn } from "@/lib/utils"
import { Clock, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ShiftCardProps {
  shift: {
    id: string
    staffId: string
    jobSiteId: string
    day: string
    startTime: string
    endTime: string
    role: string
    notes?: string
  }
  jobSite: {
    id: string
    name: string
    color: string
  }
  onClick: () => void
}

export function ShiftCard({ shift, jobSite, onClick }: ShiftCardProps) {
  // Format time (e.g., "08:00" to "8am")
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "pm" : "am"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}${minutes !== "00" ? `:${minutes}` : ""}${ampm}`
  }

  // Calculate shift duration
  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${shift.startTime}`)
    const end = new Date(`2000-01-01T${shift.endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffHrs = diffMs / (1000 * 60 * 60)
    return diffHrs.toFixed(1)
  }

  return (
    <div
      className={cn(
        "rounded-xl p-2 cursor-pointer hover:shadow-md transition-shadow relative group",
        jobSite.color.replace("bg-", "bg-opacity-15 bg-"),
        jobSite.color.replace("bg-", "border border-"),
        jobSite.color.replace("bg-", "hover:bg-opacity-20 hover:bg-"),
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="font-medium text-sm">{jobSite.name}</div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs rounded-xl px-1.5 py-0 h-5",
            jobSite.color.replace("bg-", "bg-opacity-10 bg-"),
            jobSite.color.replace("bg-", "text-"),
            jobSite.color.replace("bg-", "border-"),
          )}
        >
          {shift.role}
        </Badge>
      </div>
      <div className="flex items-center text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        <span>
          {formatTime(shift.startTime)} – {formatTime(shift.endTime)}
        </span>
        <span className="ml-1">({calculateDuration()}h)</span>
      </div>
      {shift.notes && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs mt-1 text-muted-foreground truncate flex items-center">
                <span className="truncate">{shift.notes}</span>
                {shift.notes.length > 25 && <Info className="h-3 w-3 ml-1 text-muted-foreground/70" />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">{shift.notes}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none transition-opacity flex items-center justify-center">
        <span className="text-xs font-medium bg-background/80 px-2 py-1 rounded-md shadow-sm">Click to Edit</span>
      </div>
    </div>
  )
}
