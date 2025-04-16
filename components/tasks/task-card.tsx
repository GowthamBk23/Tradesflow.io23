"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  assignee: string
  assigneeName: string
  jobSite: string
  dueDate: string
  priority: "Low" | "Medium" | "High"
  completedDate?: string
}

interface TaskCardProps {
  task: Task
  status: "todo" | "inProgress" | "awaitingApproval" | "complete"
  onDragStart: (e: React.DragEvent) => void
}

export function TaskCard({ task, status, onDragStart }: TaskCardProps) {
  // Get priority badge color
  const getPriorityColor = () => {
    switch (task.priority) {
      case "High":
        return "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
      case "Low":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Get status indicator color
  const getStatusColor = () => {
    switch (status) {
      case "todo":
        return "bg-blue-500"
      case "inProgress":
        return "bg-amber-500"
      case "awaitingApproval":
        return "bg-purple-500"
      case "complete":
        return "bg-green-500"
      default:
        return "bg-muted"
    }
  }

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card
      className="rounded-xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow cursor-grab"
      draggable
      onDragStart={onDragStart}
      onClick={() => {
        // In a real app, this would open a task details modal or navigate to a task details page
        console.log(`Viewing details for task: ${task.id}`)
      }}
    >
      <CardContent className="p-3 space-y-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", getStatusColor())} />
          <span className="text-xs text-muted-foreground">
            {status === "todo"
              ? "To Do"
              : status === "inProgress"
                ? "In Progress"
                : status === "awaitingApproval"
                  ? "Awaiting Approval"
                  : "Complete"}
          </span>
        </div>

        {/* Task title */}
        <h3 className="font-medium leading-tight">{task.title}</h3>

        {/* Task details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 rounded-full">
              <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={task.assigneeName} />
              <AvatarFallback className="text-xs">{getInitials(task.assigneeName)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
          </div>

          <Badge variant="outline" className={cn("rounded-xl text-xs", getPriorityColor())}>
            {task.priority}
          </Badge>
        </div>

        {/* Job site and due date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{task.jobSite}</span>
          </div>

          <div className="flex items-center gap-1">
            {status === "complete" ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-green-500">{formatDate(task.completedDate || "")}</span>
              </>
            ) : (
              <>
                <Calendar className="h-3 w-3" />
                <span>Due {formatDate(task.dueDate)}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
