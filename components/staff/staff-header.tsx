"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AddEditStaffModal } from "./add-edit-staff-modal"

export function StaffHeader() {
  const [viewMode, setViewMode] = useState<"all" | "team">("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const toggleViewMode = () => {
    setViewMode(viewMode === "all" ? "team" : "all")
    console.log(`Switched to ${viewMode === "all" ? "team" : "all"} view`)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Staff</h1>
        <p className="text-muted-foreground">Manage your team members and their roles</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <Label htmlFor="view-mode" className="text-sm">
              All Staff
            </Label>
            <Switch id="view-mode" checked={viewMode === "team"} onCheckedChange={toggleViewMode} />
            <Label htmlFor="view-mode" className="text-sm">
              My Team
            </Label>
          </div>
        </div>

        {/* Add Staff Button */}
        <Button className="rounded-2xl" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Add Staff Modal */}
      <AddEditStaffModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} staff={null} />
    </div>
  )
}
