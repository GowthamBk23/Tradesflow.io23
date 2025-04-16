"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight } from "lucide-react"

interface ProjectsChartProps {
  className?: string
}

export function ProjectsChart({ className }: ProjectsChartProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleViewAllProjects = () => {
    toast({
      title: "Viewing all projects",
      description: "Redirecting to projects page...",
    })
    router.push("/dashboard/projects")
  }

  return (
    <Card className={`border-border/40 bg-card/50 backdrop-blur-sm rounded-2xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>Project Status</CardTitle>
        <CardDescription>Overview of your current projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] flex items-center justify-center">
          {/* This would be a real chart in a production app */}
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">On Hold</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Project completion rate is 32% higher than last quarter
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" className="w-full rounded-xl" onClick={handleViewAllProjects}>
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
