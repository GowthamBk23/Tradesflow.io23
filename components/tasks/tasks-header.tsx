"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateTaskModal } from "./create-task-modal"

interface TasksHeaderProps {
  isStaffView?: boolean
}

export function TasksHeader({ isStaffView = false }: TasksHeaderProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{isStaffView ? "My Tasks" : "Tasks"}</h1>
        <p className="text-muted-foreground">
          {isStaffView ? "View and manage your assigned tasks" : "Create and manage tasks for your team"}
        </p>
      </div>
      {!isStaffView && (
        <Button onClick={() => setShowCreateModal(true)} className="rounded-2xl">
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      )}
      <CreateTaskModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  )
}
