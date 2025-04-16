"use client"

import type React from "react"

import { useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"

// Mock data for tasks
const initialTasks = {
  todo: [
    {
      id: "task-1",
      title: "Install kitchen cabinets",
      assignee: "john",
      assigneeName: "John Doe",
      jobSite: "Site A",
      dueDate: "2025-04-10",
      priority: "High",
    },
    {
      id: "task-2",
      title: "Paint living room walls",
      assignee: "sarah",
      assigneeName: "Sarah Smith",
      jobSite: "Site B",
      dueDate: "2025-04-12",
      priority: "Medium",
    },
    {
      id: "task-3",
      title: "Fix bathroom plumbing",
      assignee: "mike",
      assigneeName: "Mike Johnson",
      jobSite: "Site A",
      dueDate: "2025-04-08",
      priority: "High",
    },
  ],
  inProgress: [
    {
      id: "task-4",
      title: "Install flooring in bedroom",
      assignee: "lisa",
      assigneeName: "Lisa Brown",
      jobSite: "Site C",
      dueDate: "2025-04-15",
      priority: "Medium",
    },
    {
      id: "task-5",
      title: "Replace windows in living room",
      assignee: "john",
      assigneeName: "John Doe",
      jobSite: "Site B",
      dueDate: "2025-04-18",
      priority: "Low",
    },
  ],
  awaitingApproval: [
    {
      id: "task-6",
      title: "Electrical wiring inspection",
      assignee: "mike",
      assigneeName: "Mike Johnson",
      jobSite: "Site D",
      dueDate: "2025-04-09",
      priority: "High",
    },
  ],
  complete: [
    {
      id: "task-7",
      title: "Foundation work",
      assignee: "sarah",
      assigneeName: "Sarah Smith",
      jobSite: "Site A",
      dueDate: "2025-04-05",
      priority: "High",
      completedDate: "2025-04-04",
    },
    {
      id: "task-8",
      title: "Roof installation",
      assignee: "john",
      assigneeName: "John Doe",
      jobSite: "Site C",
      dueDate: "2025-04-07",
      priority: "Medium",
      completedDate: "2025-04-06",
    },
  ],
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks)

  // This would be replaced with actual drag-and-drop functionality
  const handleDragStart = (e: React.DragEvent, taskId: string, fromColumn: string) => {
    e.dataTransfer.setData("taskId", taskId)
    e.dataTransfer.setData("fromColumn", fromColumn)

    // Add a visual effect to the dragged element
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "0.6"

      // Reset opacity when drag ends
      const handleDragEnd = () => {
        e.target.style.opacity = "1"
        e.target.removeEventListener("dragend", handleDragEnd)
      }

      e.target.addEventListener("dragend", handleDragEnd)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()

    // Add visual feedback for the drop target
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = "rgba(var(--accent), 0.1)"

      // Reset background when drag leaves
      const handleDragLeave = () => {
        e.currentTarget.style.backgroundColor = ""
        e.currentTarget.removeEventListener("dragleave", handleDragLeave)
      }

      e.currentTarget.addEventListener("dragleave", handleDragLeave)
    }
  }

  const handleDrop = (e: React.DragEvent, toColumn: string) => {
    e.preventDefault()

    // Reset background color
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = ""
    }

    const taskId = e.dataTransfer.getData("taskId")
    const fromColumn = e.dataTransfer.getData("fromColumn")

    if (fromColumn === toColumn) return

    // Find the task in the source column
    const taskToMove = tasks[fromColumn as keyof typeof tasks].find((task) => task.id === taskId)

    if (!taskToMove) return

    // Create new tasks state
    const newTasks = { ...tasks }

    // Remove from source column
    newTasks[fromColumn as keyof typeof tasks] = newTasks[fromColumn as keyof typeof tasks].filter(
      (task) => task.id !== taskId,
    )

    // Add to destination column
    newTasks[toColumn as keyof typeof tasks] = [
      ...newTasks[toColumn as keyof typeof tasks],
      { ...taskToMove, ...(toColumn === "complete" ? { completedDate: new Date().toISOString().split("T")[0] } : {}) },
    ]

    setTasks(newTasks)

    // In a real app, you would update the task status in your API
    console.log(`Task ${taskId} moved from ${fromColumn} to ${toColumn}`)
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        <KanbanColumn
          title="To Do"
          count={tasks.todo.length}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          {tasks.todo.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              status="todo"
              onDragStart={(e) => handleDragStart(e, task.id, "todo")}
            />
          ))}
        </KanbanColumn>

        <KanbanColumn
          title="In Progress"
          count={tasks.inProgress.length}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "inProgress")}
        >
          {tasks.inProgress.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              status="inProgress"
              onDragStart={(e) => handleDragStart(e, task.id, "inProgress")}
            />
          ))}
        </KanbanColumn>

        <KanbanColumn
          title="Awaiting Approval"
          count={tasks.awaitingApproval.length}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "awaitingApproval")}
        >
          {tasks.awaitingApproval.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              status="awaitingApproval"
              onDragStart={(e) => handleDragStart(e, task.id, "awaitingApproval")}
            />
          ))}
        </KanbanColumn>

        <KanbanColumn
          title="Complete"
          count={tasks.complete.length}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "complete")}
        >
          {tasks.complete.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              status="complete"
              onDragStart={(e) => handleDragStart(e, task.id, "complete")}
            />
          ))}
        </KanbanColumn>
      </div>
    </div>
  )
}
