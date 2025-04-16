"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Combobox } from "@/components/ui/combobox"
import { useToast } from "@/hooks/use-toast"

interface AddEditStaffModalProps {
  isOpen: boolean
  onClose: () => void
  staff: any
  onSave?: (staffData: any) => void
}

// Predefined job roles
const jobRoles = [
  { value: "Electrician", label: "Electrician" },
  { value: "Plumber", label: "Plumber" },
  { value: "Carpenter", label: "Carpenter" },
  { value: "Painter", label: "Painter" },
  { value: "Laborer", label: "Laborer" },
  { value: "Foreman", label: "Foreman" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "HVAC Technician", label: "HVAC Technician" },
  { value: "Mason", label: "Mason" },
  { value: "Roofer", label: "Roofer" },
]

// All days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AddEditStaffModal({ isOpen, onClose, staff, onSave }: AddEditStaffModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")
  const [skillLevel, setSkillLevel] = useState("")
  const [availability, setAvailability] = useState<string[]>([])
  const [status, setStatus] = useState("active")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when staff changes
  useEffect(() => {
    if (staff) {
      setName(staff.name || "")
      setEmail(staff.email || "")
      setPhone(staff.phone || "")
      setRole(staff.role || "")
      setSkillLevel(staff.skillLevel ? staff.skillLevel.toString() : "")
      setAvailability(staff.availability || [])
      setStatus(staff.status || "active")
    } else {
      setName("")
      setEmail("")
      setPhone("")
      setRole("")
      setSkillLevel("")
      setAvailability([])
      setStatus("active")
    }
    // Clear any previous errors
    setErrors({})
  }, [staff, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    if (!role.trim()) newErrors.role = "Job role is required"
    if (!skillLevel) newErrors.skillLevel = "Skill level is required"
    if (availability.length === 0) newErrors.availability = "At least one day must be selected"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const staffData = {
      name,
      email,
      phone,
      role,
      skillLevel: Number.parseInt(skillLevel),
      availability,
      status,
      // For new staff, we'd assign empty sites initially
      assignedSites: staff?.assignedSites || [],
    }

    onSave?.(staffData)
    toast({
      title: staff ? "Staff Updated" : "Staff Added",
      description: `${name} has been ${staff ? "updated" : "added"} successfully.`,
    })
  }

  // Handle availability checkbox changes
  const handleAvailabilityChange = (day: string, checked: boolean) => {
    if (checked) {
      setAvailability([...availability, day])
    } else {
      setAvailability(availability.filter((d) => d !== day))
    }
  }

  // Handle role change
  const handleRoleChange = (value: string) => {
    setRole(value)
    if (value && errors.role) {
      setErrors({ ...errors, role: "" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>{staff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (e.target.value.trim() && errors.name) {
                      setErrors({ ...errors, name: "" })
                    }
                  }}
                  className={`rounded-xl ${errors.name ? "border-destructive" : ""}`}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (e.target.value.trim() && errors.email) {
                      setErrors({ ...errors, email: "" })
                    }
                  }}
                  className={`rounded-xl ${errors.email ? "border-destructive" : ""}`}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl" />
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <h3 className="text-sm font-medium text-muted-foreground">Job Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className={errors.role ? "text-destructive" : ""}>
                  Job Role <span className="text-destructive">*</span>
                </Label>
                <Combobox
                  options={jobRoles}
                  value={role}
                  onChange={handleRoleChange}
                  placeholder="Select or enter role"
                  allowCustomValue={true}
                  className={`rounded-xl ${errors.role ? "border-destructive" : ""}`}
                />
                {errors.role && <p className="text-xs text-destructive mt-1">{errors.role}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill-level" className={errors.skillLevel ? "text-destructive" : ""}>
                  Skill Level <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={skillLevel}
                  onValueChange={(value) => {
                    setSkillLevel(value)
                    if (value && errors.skillLevel) {
                      setErrors({ ...errors, skillLevel: "" })
                    }
                  }}
                >
                  <SelectTrigger
                    id="skill-level"
                    className={`rounded-xl ${errors.skillLevel ? "border-destructive" : ""}`}
                  >
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Beginner</SelectItem>
                    <SelectItem value="2">2 - Junior</SelectItem>
                    <SelectItem value="3">3 - Intermediate</SelectItem>
                    <SelectItem value="4">4 - Advanced</SelectItem>
                    <SelectItem value="5">5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
                {errors.skillLevel && <p className="text-xs text-destructive mt-1">{errors.skillLevel}</p>}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label className={errors.availability ? "text-destructive" : ""}>
                Availability <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.toLowerCase()}`}
                      checked={availability.includes(day)}
                      onCheckedChange={(checked) => {
                        handleAvailabilityChange(day, checked as boolean)
                        if (checked && errors.availability) {
                          setErrors({ ...errors, availability: "" })
                        }
                      }}
                    />
                    <Label htmlFor={`day-${day.toLowerCase()}`} className="text-sm font-normal">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.availability && <p className="text-xs text-destructive mt-1">{errors.availability}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <RadioGroup value={status} onValueChange={setStatus} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="status-active" />
                  <Label htmlFor="status-active" className="text-sm font-normal">
                    Active
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="status-inactive" />
                  <Label htmlFor="status-inactive" className="text-sm font-normal">
                    Inactive
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl">
              {staff ? "Update Staff" : "Add Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
