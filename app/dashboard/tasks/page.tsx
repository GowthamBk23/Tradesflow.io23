"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TasksHeader } from "@/components/tasks/tasks-header"
import { TaskFilters } from "@/components/tasks/task-filters"
import { KanbanBoard } from "@/components/tasks/kanban-board"
import { StaffTasksList } from "@/components/staff/staff-tasks-list"
import { useUser } from "@/contexts/user-context"

export default function TasksPage() {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardShell>
      <DashboardHeader>
        <TasksHeader isStaffView={user?.role === "staff"} />
      </DashboardHeader>
      <TaskFilters isStaffView={user?.role === "staff"} />

      {user?.role === "staff" ? <StaffTasksList staffId={user.id || ""} isLoading={isLoading} /> : <KanbanBoard />}
    </DashboardShell>
  )
}
