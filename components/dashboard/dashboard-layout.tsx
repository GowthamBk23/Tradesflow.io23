"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { useUser } from "@/contexts/user-context"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Define route permissions for each role
const rolePermissions = {
  admin: [
    "/dashboard",
    "/dashboard/tasks",
    "/dashboard/projects",
    "/dashboard/schedule",
    "/dashboard/staff",
    "/dashboard/clients",
    "/dashboard/invoices",
    "/dashboard/documents",
    "/dashboard/time-tracking",
    "/dashboard/reports",
    "/dashboard/contracts",
    "/dashboard/invoice-upload",
    "/dashboard/chat",
    "/dashboard/admin-logs",
    "/dashboard/inventory",
    "/dashboard/materials",
    "/dashboard/payroll",
    "/dashboard/settings",
    "/dashboard/activity",
  ],
  staff: [
    "/dashboard",
    "/dashboard/tasks",
    "/dashboard/documents",
    "/dashboard/time-tracking",
    "/dashboard/chat",
    "/dashboard/inventory",
    "/dashboard/materials",
    "/dashboard/settings",
  ],
  client: [
    "/dashboard",
    "/dashboard/contracts",
    "/dashboard/invoices",
    "/dashboard/documents",
    "/dashboard/chat",
    "/dashboard/settings",
  ],
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const isMobile = useIsMobile()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { user, isLoading } = useUser()
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  // Close mobile nav when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileNavOpen(false)
    }
  }, [isMobile])

  // Check if the current route is allowed for the user's role
  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.role
      const allowedRoutes = rolePermissions[userRole]

      // Check if the current path is allowed
      const isRouteAllowed = allowedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

      // If not allowed, redirect to dashboard
      if (!isRouteAllowed) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }
  }, [pathname, user, isLoading, router, toast])

  // Show loading state while user data is being fetched
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If no user is found, this would typically redirect to login
  if (!user) {
    // In a real app, you would redirect to login
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>No user found. Please log in.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - hidden on mobile */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} className="hidden md:flex" userRole={user.role} />

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileNavOpen} setIsOpen={setIsMobileNavOpen} userRole={user.role} />

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "md:ml-64" : "md:ml-20"} transition-all duration-300`}>
        <div className="flex min-h-screen flex-col">
          <Header
            isMobile={isMobile}
            setMobileNavOpen={setIsMobileNavOpen}
            userName={user.name}
            userAvatar={user.avatar}
            userRole={user.role}
          />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
