"use client"

import type React from "react"

import { UserProvider } from "@/contexts/user-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </UserProvider>
  )
}
