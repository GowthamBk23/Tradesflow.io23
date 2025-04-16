import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  title: string
  count: number
  children: React.ReactNode
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export function KanbanColumn({ title, count, children, onDragOver, onDrop }: KanbanColumnProps) {
  // Define column colors based on status
  const getColumnColor = () => {
    switch (title) {
      case "To Do":
        return "border-blue-500/20"
      case "In Progress":
        return "border-amber-500/20"
      case "Awaiting Approval":
        return "border-purple-500/20"
      case "Complete":
        return "border-green-500/20"
      default:
        return "border-border/40"
    }
  }

  return (
    <Card
      className={cn(
        "border-t-4 rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm w-80 shrink-0",
        getColumnColor(),
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">{count}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto max-h-[calc(100vh-16rem)]">{children}</CardContent>
    </Card>
  )
}
