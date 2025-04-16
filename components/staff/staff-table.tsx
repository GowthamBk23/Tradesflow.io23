"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, MapPin, Calendar } from "lucide-react"
import { AddEditStaffModal } from "./add-edit-staff-modal"
import { DeleteStaffDialog } from "./delete-staff-dialog"
import { useIsMobile } from "@/hooks/use-mobile"

// Mock data for staff members
const initialStaffData = [
  {
    id: "staff-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+44 7123 456789",
    role: "Electrician",
    skillLevel: 5,
    assignedSites: ["Site A", "Site B"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "active",
  },
  {
    id: "staff-2",
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    phone: "+44 7234 567890",
    role: "Plumber",
    skillLevel: 4,
    assignedSites: ["Site C"],
    availability: ["Monday", "Wednesday", "Friday"],
    status: "active",
  },
  {
    id: "staff-3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+44 7345 678901",
    role: "Carpenter",
    skillLevel: 3,
    assignedSites: ["Site B", "Site D"],
    availability: ["Tuesday", "Thursday"],
    status: "active",
  },
  {
    id: "staff-4",
    name: "Lisa Brown",
    email: "lisa.brown@example.com",
    phone: "+44 7456 789012",
    role: "Painter",
    skillLevel: 4,
    assignedSites: ["Site A"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "active",
  },
  {
    id: "staff-5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "+44 7567 890123",
    role: "Laborer",
    skillLevel: 2,
    assignedSites: ["Site C", "Site D"],
    availability: ["Monday", "Tuesday", "Wednesday"],
    status: "inactive",
  },
  {
    id: "staff-6",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    phone: "+44 7678 901234",
    role: "Foreman",
    skillLevel: 5,
    assignedSites: ["Site A", "Site B", "Site C"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "active",
  },
  {
    id: "staff-7",
    name: "James Miller",
    email: "james.miller@example.com",
    phone: "+44 7789 012345",
    role: "Project Manager",
    skillLevel: 5,
    assignedSites: ["Site A", "Site B", "Site C", "Site D"],
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    status: "active",
  },
]

export function StaffTable() {
  const [staffData, setStaffData] = useState(initialStaffData)
  const [editingStaff, setEditingStaff] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingStaff, setDeletingStaff] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const isMobile = useIsMobile()

  // Get skill level label
  const getSkillLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner"
      case 2:
        return "Junior"
      case 3:
        return "Intermediate"
      case 4:
        return "Advanced"
      case 5:
        return "Expert"
      default:
        return "Unknown"
    }
  }

  // Handle edit staff
  const handleEditStaff = (staff: any) => {
    setEditingStaff(staff)
    setIsEditModalOpen(true)
  }

  // Handle delete staff
  const handleDeleteStaff = (staff: any) => {
    setDeletingStaff(staff)
    setIsDeleteDialogOpen(true)
  }

  // Handle save staff (update)
  const handleSaveStaff = (updatedStaff: any) => {
    if (editingStaff) {
      // Update existing staff
      setStaffData(staffData.map((staff) => (staff.id === editingStaff.id ? { ...staff, ...updatedStaff } : staff)))
    } else {
      // Add new staff
      const newStaff = {
        id: `staff-${Date.now()}`,
        ...updatedStaff,
      }
      setStaffData([...staffData, newStaff])
    }

    setIsEditModalOpen(false)
    setEditingStaff(null)
  }

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deletingStaff) {
      setStaffData(staffData.filter((staff) => staff.id !== deletingStaff.id))
      setIsDeleteDialogOpen(false)
      setDeletingStaff(null)
    }
  }

  // Render desktop table view
  const renderTableView = () => (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Skill Level</TableHead>
            <TableHead>Assigned Sites</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffData.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
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
                    <div>{staff.name}</div>
                    <div className="text-xs text-muted-foreground">{staff.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{staff.role}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} filled={i < staff.skillLevel} />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground">{getSkillLevelLabel(staff.skillLevel)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {staff.assignedSites.map((site) => (
                    <Badge
                      key={site}
                      variant="outline"
                      className="rounded-xl text-xs bg-blue-500/10 text-blue-500 border-blue-500/20"
                    >
                      {site}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {staff.availability.length === 5 ? "Full-time" : staff.availability.join(", ")}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`rounded-xl ${
                    staff.status === "active"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}
                >
                  {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleEditStaff(staff)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteStaff(staff)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Render mobile card view
  const renderCardView = () => (
    <div className="space-y-4">
      {staffData.map((staff) => (
        <Card key={staff.id} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={staff.name} />
                  <AvatarFallback>
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                  <CardDescription>{staff.email}</CardDescription>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`rounded-xl ${
                  staff.status === "active"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                }`}
              >
                {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="flex items-center gap-1">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span>{staff.role}</span>
              </div>
              <div className="flex items-center">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} filled={i < staff.skillLevel} size="sm" />
                  ))}
                </div>
                <span className="ml-1 text-xs text-muted-foreground">{getSkillLevelLabel(staff.skillLevel)}</span>
              </div>
              <div className="flex items-start gap-1 col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {staff.assignedSites.map((site) => (
                    <Badge
                      key={site}
                      variant="outline"
                      className="rounded-xl text-xs bg-blue-500/10 text-blue-500 border-blue-500/20"
                    >
                      {site}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-1 col-span-2">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <span>{staff.availability.length === 5 ? "Full-time" : staff.availability.join(", ")}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleEditStaff(staff)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDeleteStaff(staff)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      {isMobile ? renderCardView() : renderTableView()}

      {/* Edit Staff Modal */}
      <AddEditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingStaff(null)
        }}
        staff={editingStaff}
        onSave={handleSaveStaff}
      />

      {/* Delete Staff Dialog */}
      <DeleteStaffDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingStaff(null)
        }}
        onConfirm={handleConfirmDelete}
        staff={deletingStaff}
      />
    </>
  )
}

// Star component for skill level
function Star({ filled, size = "md" }: { filled: boolean; size?: "sm" | "md" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "currentColor" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} ${filled ? "text-amber-500" : "text-muted-foreground"}`}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

// Wrench icon component
function Wrench({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}
