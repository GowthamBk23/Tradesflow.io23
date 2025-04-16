"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import { ShiftCard } from "./shift-card"
import { ShiftAssignmentModal } from "./shift-assignment-modal"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/user-context"
import { supabase } from "@/lib/supabase"

// Mock data for staff members
const staffMembers = [
  { id: "john", name: "John Doe", role: "Electrician" },
  { id: "sarah", name: "Sarah Smith", role: "Plumber" },
  { id: "mike", name: "Mike Johnson", role: "Carpenter" },
  { id: "lisa", name: "Lisa Brown", role: "Painter" },
  { id: "david", name: "David Wilson", role: "Laborer" },
  { id: "emma", name: "Emma Davis", role: "Electrician" },
]

// Mock data for job sites
const jobSites = [
  { id: "site-a", name: "Site A", color: "bg-blue-500" },
  { id: "site-b", name: "Site B", color: "bg-teal-500" },
  { id: "site-c", name: "Site C", color: "bg-purple-500" },
  { id: "site-d", name: "Site D", color: "bg-amber-500" },
]

// Mock data for shifts
const initialShifts = [
  {
    id: "shift-1",
    staffId: "john",
    jobSiteId: "site-a",
    day: "monday",
    startTime: "08:00",
    endTime: "16:00",
    role: "Electrician",
    notes: "Install main electrical panel",
  },
  {
    id: "shift-2",
    staffId: "sarah",
    jobSiteId: "site-b",
    day: "monday",
    startTime: "07:30",
    endTime: "15:30",
    role: "Plumber",
    notes: "Bathroom fixtures installation",
  },
  {
    id: "shift-3",
    staffId: "mike",
    jobSiteId: "site-c",
    day: "monday",
    startTime: "08:00",
    endTime: "17:00",
    role: "Carpenter",
    notes: "Kitchen cabinets installation",
  },
  {
    id: "shift-4",
    staffId: "john",
    jobSiteId: "site-a",
    day: "tuesday",
    startTime: "08:00",
    endTime: "16:00",
    role: "Electrician",
    notes: "Continue electrical work",
  },
  {
    id: "shift-5",
    staffId: "sarah",
    jobSiteId: "site-b",
    day: "tuesday",
    startTime: "07:30",
    endTime: "15:30",
    role: "Plumber",
    notes: "Kitchen plumbing",
  },
  {
    id: "shift-6",
    staffId: "lisa",
    jobSiteId: "site-d",
    day: "tuesday",
    startTime: "09:00",
    endTime: "17:00",
    role: "Painter",
    notes: "Prime walls",
  },
  {
    id: "shift-7",
    staffId: "david",
    jobSiteId: "site-c",
    day: "wednesday",
    startTime: "08:00",
    endTime: "16:00",
    role: "Laborer",
    notes: "Site cleanup",
  },
  {
    id: "shift-8",
    staffId: "emma",
    jobSiteId: "site-a",
    day: "wednesday",
    startTime: "08:30",
    endTime: "16:30",
    role: "Electrician",
    notes: "Light fixtures installation",
  },
  {
    id: "shift-9",
    staffId: "mike",
    jobSiteId: "site-b",
    day: "wednesday",
    startTime: "07:00",
    endTime: "15:00",
    role: "Carpenter",
    notes: "Door installation",
  },
  {
    id: "shift-10",
    staffId: "lisa",
    jobSiteId: "site-d",
    day: "thursday",
    startTime: "09:00",
    endTime: "17:00",
    role: "Painter",
    notes: "Paint walls",
  },
  {
    id: "shift-11",
    staffId: "john",
    jobSiteId: "site-c",
    day: "thursday",
    startTime: "08:00",
    endTime: "16:00",
    role: "Electrician",
    notes: "Install outlets",
  },
  {
    id: "shift-12",
    staffId: "sarah",
    jobSiteId: "site-a",
    day: "friday",
    startTime: "07:30",
    endTime: "15:30",
    role: "Plumber",
    notes: "Final plumbing inspection",
  },
  {
    id: "shift-13",
    staffId: "mike",
    jobSiteId: "site-b",
    day: "friday",
    startTime: "08:00",
    endTime: "16:00",
    role: "Carpenter",
    notes: "Trim work",
  },
  {
    id: "shift-14",
    staffId: "emma",
    jobSiteId: "site-d",
    day: "friday",
    startTime: "08:30",
    endTime: "16:30",
    role: "Electrician",
    notes: "Final electrical inspection",
  },
]

// Days of the week
const daysOfWeek = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
]

export function ScheduleGrid() {
  const [shifts, setShifts] = useState(initialShifts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ staffId: string; day: string } | null>(null)
  const [editingShift, setEditingShift] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()

  // Load shifts on component mount (simulating API call)
  useEffect(() => {
    const loadShifts = async () => {
      setIsLoading(true)

      try {
        // In a real app, we would fetch shifts from Supabase here
        // const { data, error } = await supabase
        //   .from('staff_site_assignments')
        //   .select('*')

        // If the user is a staff member, filter by their ID
        // if (user?.role === 'staff') {
        //   query = query.eq('staff_id', user.id)
        // }

        // For now, we'll use our mock data
        // If the user is a staff member, filter the shifts to only show theirs
        let filteredShifts = initialShifts
        if (user?.role === "staff") {
          // Use the user ID from the context, or fall back to a default staff ID
          const staffId = user.id === "staff-1" ? "sarah" : "john"
          filteredShifts = initialShifts.filter((shift) => shift.staffId === staffId)
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setShifts(filteredShifts)
      } catch (error) {
        console.error("Error loading shifts:", error)
        toast({
          title: "Error loading schedule",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadShifts()
  }, [user, toast])

  // Set up Supabase Realtime subscription for schedule updates
  useEffect(() => {
    if (!user?.id) return

    // Create a Supabase Realtime channel for staff_site_assignments
    const channel = supabase
      .channel("schedule-updates")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "staff_site_assignments",
          // If the user is a staff member, only listen for their assignments
          ...(user.role === "staff" && { filter: `staff_id=eq.${user.id}` }),
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === "INSERT") {
            // Convert the database record to our shift format
            const newShift = {
              id: payload.new.id,
              staffId: payload.new.staff_id,
              jobSiteId: payload.new.site_id,
              day: payload.new.day_of_week.toLowerCase(),
              startTime: payload.new.start_time,
              endTime: payload.new.end_time,
              role: payload.new.role,
              notes: payload.new.notes,
            }

            // Add the new shift to the state
            setShifts((prev) => [...prev, newShift])

            // Show a toast notification
            toast({
              title: "New shift assigned",
              description: `${payload.new.day_of_week} at ${payload.new.start_time} - ${payload.new.end_time}`,
            })
          } else if (payload.eventType === "UPDATE") {
            // Update the existing shift in the state
            setShifts((prev) =>
              prev.map((shift) =>
                shift.id === payload.new.id
                  ? {
                      id: payload.new.id,
                      staffId: payload.new.staff_id,
                      jobSiteId: payload.new.site_id,
                      day: payload.new.day_of_week.toLowerCase(),
                      startTime: payload.new.start_time,
                      endTime: payload.new.end_time,
                      role: payload.new.role,
                      notes: payload.new.notes,
                    }
                  : shift,
              ),
            )

            // Show a toast notification
            toast({
              title: "Shift updated",
              description: `${payload.new.day_of_week} at ${payload.new.start_time} - ${payload.new.end_time}`,
            })
          } else if (payload.eventType === "DELETE") {
            // Remove the deleted shift from the state
            setShifts((prev) => prev.filter((shift) => shift.id !== payload.old.id))

            // Show a toast notification
            toast({
              title: "Shift removed",
              description: `The shift on ${payload.old.day_of_week} has been removed.`,
            })
          }
        },
      )
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, toast])

  // Get shifts for a specific staff member and day
  const getShiftsForCell = (staffId: string, day: string) => {
    return shifts.filter((shift) => shift.staffId === staffId && shift.day === day)
  }

  // Handle click on an empty cell to add a new shift
  const handleAddShift = (staffId: string, day: string) => {
    setSelectedCell({ staffId, day })
    setEditingShift(null)
    setIsModalOpen(true)

    toast({
      title: "Add Shift",
      description: `Adding a new shift for ${staffMembers.find((s) => s.id === staffId)?.name} on ${day.charAt(0).toUpperCase() + day.slice(1)}`,
    })
  }

  // Handle click on an existing shift to edit it
  const handleEditShift = (shift: any) => {
    setSelectedCell({ staffId: shift.staffId, day: shift.day })
    setEditingShift(shift)
    setIsModalOpen(true)

    toast({
      title: "Edit Shift",
      description: `Editing shift for ${staffMembers.find((s) => s.id === shift.staffId)?.name} at ${shift.jobSiteId.replace("site-", "Site ")}`,
    })
  }

  // Handle saving a shift (new or edited)
  const handleSaveShift = async (shiftData: any) => {
    try {
      if (editingShift) {
        // Update existing shift
        // In a real app, we would update the shift in Supabase
        // const { data, error } = await supabase
        //   .from('staff_site_assignments')
        //   .update({
        //     site_id: shiftData.jobSiteId,
        //     start_time: shiftData.startTime,
        //     end_time: shiftData.endTime,
        //     role: shiftData.role,
        //     notes: shiftData.notes,
        //   })
        //   .eq('id', editingShift.id)

        // For now, we'll update our local state
        setShifts(shifts.map((shift) => (shift.id === editingShift.id ? { ...shift, ...shiftData } : shift)))
      } else {
        // Add new shift
        // In a real app, we would insert the shift into Supabase
        // const { data, error } = await supabase
        //   .from('staff_site_assignments')
        //   .insert({
        //     staff_id: selectedCell?.staffId,
        //     site_id: shiftData.jobSiteId,
        //     day_of_week: selectedCell?.day,
        //     start_time: shiftData.startTime,
        //     end_time: shiftData.endTime,
        //     role: shiftData.role,
        //     notes: shiftData.notes,
        //   })

        // For now, we'll update our local state
        const newShift = {
          id: `shift-${Date.now()}`,
          staffId: selectedCell?.staffId,
          day: selectedCell?.day,
          ...shiftData,
        }
        setShifts([...shifts, newShift])
      }

      setIsModalOpen(false)
      setSelectedCell(null)
      setEditingShift(null)
    } catch (error) {
      console.error("Error saving shift:", error)
      toast({
        title: "Error saving shift",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a shift
  const handleDeleteShift = async (shiftId: string) => {
    try {
      // In a real app, we would delete the shift from Supabase
      // const { error } = await supabase
      //   .from('staff_site_assignments')
      //   .delete()
      //   .eq('id', shiftId)

      // For now, we'll update our local state
      setShifts(shifts.filter((shift) => shift.id !== shiftId))
      setIsModalOpen(false)
      setSelectedCell(null)
      setEditingShift(null)
    } catch (error) {
      console.error("Error deleting shift:", error)
      toast({
        title: "Error deleting shift",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    )
  }

  // For staff users, only show their own row
  const displayStaffMembers =
    user?.role === "staff"
      ? staffMembers.filter((staff) => {
          // Use the user ID from the context, or fall back to a default staff ID
          const staffId = user.id === "staff-1" ? "sarah" : "john"
          return staff.id === staffId
        })
      : staffMembers

  return (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header row with days of the week */}
          <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-border/40">
            <div className="p-4 font-medium text-muted-foreground">Staff</div>
            {daysOfWeek.map((day) => (
              <div key={day.id} className="p-4 font-medium text-center">
                {day.name}
              </div>
            ))}
          </div>

          {/* Staff rows */}
          {displayStaffMembers.map((staff) => (
            <div
              key={staff.id}
              className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-border/40 last:border-b-0"
            >
              {/* Staff info cell */}
              <div className="p-4 flex items-center gap-3 border-r border-border/40">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={staff.name} />
                  <AvatarFallback>
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{staff.name}</div>
                  <div className="text-xs text-muted-foreground">{staff.role}</div>
                </div>
              </div>

              {/* Day cells */}
              {daysOfWeek.map((day) => {
                const cellShifts = getShiftsForCell(staff.id, day.id)

                return (
                  <div
                    key={`${staff.id}-${day.id}`}
                    className="p-2 min-h-[100px] border-r border-border/40 last:border-r-0 relative"
                  >
                    {cellShifts.length > 0 ? (
                      <div className="space-y-2">
                        {cellShifts.map((shift) => (
                          <ShiftCard
                            key={shift.id}
                            shift={shift}
                            jobSite={jobSites.find((site) => site.id === shift.jobSiteId)!}
                            onClick={() => handleEditShift(shift)}
                          />
                        ))}
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-full rounded-2xl border border-dashed border-border/40 flex flex-col items-center justify-center gap-1 hover:bg-accent/50"
                        onClick={() => handleAddShift(staff.id, day.id)}
                        disabled={user?.role === "staff"} // Staff can't add shifts
                      >
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Add Shift</span>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Shift Assignment Modal */}
      <ShiftAssignmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCell(null)
          setEditingShift(null)
        }}
        onSave={handleSaveShift}
        onDelete={handleDeleteShift}
        shift={editingShift}
        staffMember={selectedCell ? staffMembers.find((s) => s.id === selectedCell.staffId) : null}
        day={selectedCell?.day}
        jobSites={jobSites}
      />
    </div>
  )
}
