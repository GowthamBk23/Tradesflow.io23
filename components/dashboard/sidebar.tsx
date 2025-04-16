"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Users,
  UserCircle,
  FileText,
  FileIcon,
  Clock,
  BarChart3,
  FileCode,
  Upload,
  MessageSquare,
  ClipboardList,
  Package,
  Truck,
  DollarSign,
  Settings,
  LogOut,
  ListChecks,
} from "lucide-react"
import type { UserRole } from "@/contexts/user-context"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  className?: string
  userRole: UserRole
}

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
  requiredPermission?: string
}

export function Sidebar({ isOpen, setIsOpen, className, userRole }: SidebarProps) {
  const pathname = usePathname()

  // Define navigation items with role-based access
  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "staff", "client"],
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: CheckSquare,
      roles: ["admin", "staff"],
      requiredPermission: "view:own",
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: ListChecks,
      roles: ["admin"],
      requiredPermission: "view:all",
    },
    {
      title: "Schedule",
      href: "/dashboard/schedule",
      icon: Calendar,
      roles: ["admin"],
      requiredPermission: "view:all",
    },
    {
      title: "Staff",
      href: "/dashboard/staff",
      icon: Users,
      roles: ["admin"],
      requiredPermission: "manage:users",
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: UserCircle,
      roles: ["admin"],
      requiredPermission: "manage:users",
    },
    {
      title: "Invoices",
      href: "/dashboard/invoices",
      icon: FileText,
      roles: ["admin", "client"],
      requiredPermission: "view:invoices",
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: FileIcon,
      roles: ["admin", "staff", "client"],
      requiredPermission: "view:documents",
    },
    {
      title: "Time Tracking",
      href: "/dashboard/time-tracking",
      icon: Clock,
      roles: ["admin", "staff"],
      requiredPermission: "log:time",
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["admin"],
      requiredPermission: "view:reports",
    },
    {
      title: "Contracts",
      href: "/dashboard/contracts",
      icon: FileCode,
      roles: ["admin", "client"],
      requiredPermission: "view:contracts",
    },
    {
      title: "Invoice Upload",
      href: "/dashboard/invoice-upload",
      icon: Upload,
      roles: ["admin"],
      requiredPermission: "create:all",
    },
    {
      title: "Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      roles: ["admin", "staff", "client"],
    },
    {
      title: "Admin Logs",
      href: "/dashboard/admin-logs",
      icon: ClipboardList,
      roles: ["admin"],
      requiredPermission: "view:all",
    },
    {
      title: "Inventory",
      href: "/dashboard/inventory",
      icon: Package,
      roles: ["admin", "staff"],
      requiredPermission: "view:inventory",
    },
    {
      title: "Materials",
      href: "/dashboard/materials",
      icon: Truck,
      roles: ["admin", "staff"],
      requiredPermission: "view:inventory",
    },
    {
      title: "Payroll",
      href: "/dashboard/payroll",
      icon: DollarSign,
      roles: ["admin"],
      requiredPermission: "manage:billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "staff", "client"],
      requiredPermission: "manage:profile",
    },
  ]

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300",
        isOpen ? "w-64" : "w-20",
        className,
      )}
    >
      {/* Logo and Toggle */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-border/40 px-4",
          isOpen ? "justify-between" : "justify-center",
        )}
      >
        {isOpen ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
              <span className="font-bold text-xl">TF</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              TradesFlow
            </span>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
              <span className="font-bold text-xl">TF</span>
            </div>
          </Link>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all hover:bg-accent",
                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                !isOpen && "justify-center px-0",
              )}
            >
              <item.icon className={cn("h-4 w-4", !isOpen && "h-5 w-5")} />
              {isOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Logout Button */}
      <div className="border-t border-border/40 p-2">
        <Link
          href="/auth"
          className={cn(
            "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent",
            !isOpen && "justify-center px-0",
          )}
        >
          <LogOut className={cn("h-4 w-4", !isOpen && "h-5 w-5")} />
          {isOpen && <span>Logout</span>}
        </Link>
      </div>
    </div>
  )
}
