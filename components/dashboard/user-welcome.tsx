"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle } from "lucide-react"

export function UserWelcome() {
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateTask = () => {
    toast({
      title: "Creating new task",
      description: "Redirecting to tasks page...",
    })
    router.push("/dashboard/tasks?new=true")
  }

  const handleCreateProject = () => {
    toast({
      title: "Creating new project",
      description: "Redirecting to projects page...",
    })
    router.push("/dashboard/projects?new=true")
  }

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, John!</h1>
        <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button className="rounded-xl" onClick={handleCreateTask}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Task
        </Button>
        <Button variant="outline" className="rounded-xl" onClick={handleCreateProject}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  )
}
