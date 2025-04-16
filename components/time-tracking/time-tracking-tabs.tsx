"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClockInOutSection } from "./clock-in-out-section"
import { LoggedTimeSection } from "./logged-time-section"

export function TimeTrackingTabs() {
  const [activeTab, setActiveTab] = useState("clock")

  return (
    <Tabs defaultValue="clock" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 w-full md:w-[400px] rounded-xl">
        <TabsTrigger value="clock" className="rounded-xl">
          Clock In / Out
        </TabsTrigger>
        <TabsTrigger value="logs" className="rounded-xl">
          Logged Time
        </TabsTrigger>
      </TabsList>

      <TabsContent value="clock" className="mt-6">
        <ClockInOutSection />
      </TabsContent>

      <TabsContent value="logs" className="mt-6">
        <LoggedTimeSection />
      </TabsContent>
    </Tabs>
  )
}
