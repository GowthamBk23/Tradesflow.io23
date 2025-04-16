"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AIScheduleButton() {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateSchedule = async () => {
    setIsGenerating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setIsGenerating(false)

    toast({
      title: "AI Schedule Generated",
      description: "Schedule has been optimized based on staff availability, skills, and job site requirements.",
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleGenerateSchedule} disabled={isGenerating} className="rounded-2xl">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Schedule...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Schedule
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium mb-1">AI Schedule Generator</p>
            <p className="text-xs text-muted-foreground">Automatically creates an optimized schedule based on:</p>
            <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1">
              <li>Staff availability and skills</li>
              <li>Job site requirements and priorities</li>
              <li>Travel time and logistics</li>
              <li>Previous scheduling patterns</li>
              <li>Project deadlines and milestones</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
