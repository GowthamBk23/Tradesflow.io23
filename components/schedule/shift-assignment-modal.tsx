"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShiftAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (shiftData: any) => void
  onDelete: (shiftId: string) => void
  shift: any
  staffMember: { id: string; name: string; role: string } | null
  day: string | undefined
  jobSites: { id: string; name: string; color: string }[]
}

export function ShiftAssignmentModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  shift,
  staffMember,
  day,
  jobSites,
}: ShiftAssignmentModalProps) {
  const [jobSiteId, setJobSiteId] = useState("")
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("16:00")
  const [role, setRole] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Reset form when shift changes
  useEffect(() => {
    if (shift) {
      setJobSiteId(shift.jobSiteId)
      setStartTime(shift.startTime)
      setEndTime(shift.endTime)
      setRole(shift.role)
      setNotes(shift.notes || "")
    } else {
      setJobSiteId("")
      setStartTime("08:00")
      setEndTime("16:00")
      setRole(staffMember?.role || "")
      setNotes("")
    }
    setErrors({})
  }, [shift, staffMember])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!jobSiteId) {
      newErrors.jobSiteId = "Job site is required"
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required"
    }

    if (!endTime) {
      newErrors.endTime = "End time is required"
    }

    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)

      if (end <= start) {
        newErrors.endTime = "End time must be after start time"
      }
    }

    if (!role) {
      newErrors.role = "Role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave({
        jobSiteId,
        startTime,
        endTime,
        role,
        notes,
      })

      toast({
        title: shift ? "Shift Updated" : "Shift Created",
        description: shift
          ? `Shift for ${staffMember?.name} on ${formatDayName(day)} has been updated`
          : `New shift for ${staffMember?.name} on ${formatDayName(day)} has been created`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the shift",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!shift) return

    setIsDeleting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onDelete(shift.id)

      toast({
        title: "Shift Deleted",
        description: `Shift for ${staffMember?.name} on ${formatDayName(day)} has been deleted`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the shift",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Format day name for display
  const formatDayName = (dayId: string | undefined) => {
    if (!dayId) return ""
    return dayId.charAt(0).toUpperCase() + dayId.slice(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && !isDeleting && onClose()}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{shift ? "Edit Shift" : "Assign New Shift"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Staff and Day (non-editable) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Staff Member</Label>
              <div className="h-10 px-3 py-2 rounded-xl border border-input bg-background text-sm">
                {staffMember?.name || ""}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Day</Label>
              <div className="h-10 px-3 py-2 rounded-xl border border-input bg-background text-sm">
                {formatDayName(day)}
              </div>
            </div>
          </div>

          {/* Job Site */}
          <div className="space-y-2">
            <Label htmlFor="job-site" className={errors.jobSiteId ? "text-destructive" : ""}>
              Job Site {errors.jobSiteId && <span className="text-xs">({errors.jobSiteId})</span>}
            </Label>
            <Select value={jobSiteId} onValueChange={setJobSiteId} required>
              <SelectTrigger id="job-site" className={`rounded-xl ${errors.jobSiteId ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select job site" />
              </SelectTrigger>
              <SelectContent>
                {jobSites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time" className={errors.startTime ? "text-destructive" : ""}>
                Start Time {errors.startTime && <span className="text-xs">({errors.startTime})</span>}
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`rounded-xl ${errors.startTime ? "border-destructive" : ""}`}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time" className={errors.endTime ? "text-destructive" : ""}>
                End Time {errors.endTime && <span className="text-xs">({errors.endTime})</span>}
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`rounded-xl ${errors.endTime ? "border-destructive" : ""}`}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className={errors.role ? "text-destructive" : ""}>
              Role {errors.role && <span className="text-xs">({errors.role})</span>}
            </Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger id="role" className={`rounded-xl ${errors.role ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Electrician">Electrician</SelectItem>
                <SelectItem value="Plumber">Plumber</SelectItem>
                <SelectItem value="Carpenter">Carpenter</SelectItem>
                <SelectItem value="Painter">Painter</SelectItem>
                <SelectItem value="Laborer">Laborer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details about this shift"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] rounded-xl"
            />
          </div>

          <DialogFooter className="flex justify-between items-center pt-4">
            <div>
              {shift && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="rounded-xl"
                  onClick={handleDelete}
                  disabled={isDeleting || isSubmitting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={onClose}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isSubmitting || isDeleting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    {shift ? "Updating..." : "Creating..."}
                  </>
                ) : shift ? (
                  "Update Shift"
                ) : (
                  "Create Shift"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
