"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Moon, Sun, Monitor } from "lucide-react"

export default function ThemeSettings() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState("system")

  // Ensure component is mounted before rendering theme-specific elements
  useEffect(() => {
    setMounted(true)
    if (theme) {
      setCurrentTheme(theme)
    }
  }, [theme])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Set the theme using next-themes
    setTheme(currentTheme)

    toast({
      title: "Theme updated",
      description: `Your theme has been set to ${currentTheme}.`,
    })

    setIsLoading(false)
  }

  if (!mounted) {
    return <div className="space-y-6">Loading theme settings...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application. Automatically switch between day and night themes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <RadioGroup
          value={currentTheme}
          onValueChange={setCurrentTheme}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="flex h-48 w-full items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <div className="space-y-2 rounded-sm bg-white p-2 w-full h-full flex flex-col justify-between">
                <div className="space-y-2 rounded-md bg-slate-100 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-200" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-200" />
                </div>
                <div className="flex-1 space-y-2 rounded-md bg-slate-100 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-200" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-200" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-200" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <Label htmlFor="light">Light</Label>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex h-48 w-full items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <div className="space-y-2 rounded-sm bg-slate-950 p-2 w-full h-full flex flex-col justify-between">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-700" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-700" />
                </div>
                <div className="flex-1 space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-700" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-700" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-700" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Moon className="h-5 w-5" />
              <Label htmlFor="dark">Dark</Label>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex h-48 w-full items-center justify-center rounded-md border-2 border-muted bg-popover p-1 hover:border-accent">
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <div className="space-y-2 rounded-sm bg-white p-2 w-full h-full flex flex-col">
                <div className="space-y-2 rounded-md bg-slate-100 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-200" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-200" />
                </div>
                <div className="space-y-2 rounded-md bg-slate-950 p-2 shadow-sm">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-700" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-700" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Monitor className="h-5 w-5" />
              <Label htmlFor="system">System</Label>
            </div>
          </div>
        </RadioGroup>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  )
}
