"use client"

import type React from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
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

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  userRole: UserRole
}

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

export function MobileNav({ isOpen, setIsOpen, userRole }: MobileNavProps) {
  const pathname = usePathname()

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
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: ListChecks,
      roles: ["admin"],
    },
    {
      title: "Schedule",
      href: "/dashboard/schedule",
      icon: Calendar,
      roles: ["admin"],
    },
    {
      title: "Staff",
      href: "/dashboard/staff",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: "Clients",
      href: "/dashboard/clients",
      icon: UserCircle,
      roles: ["admin"],
    },
    {
      title: "Invoices",
      href: "/dashboard/invoices",
      icon: FileText,
      roles: ["admin", "client"],
    },
    {
      title: "Documents",
      href: "/dashboard/documents",
      icon: FileIcon,
      roles: ["admin", "staff", "client"],
    },
    {
      title: "Time Tracking",
      href: "/dashboard/time-tracking",
      icon: Clock,
      roles: ["admin", "staff"],
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
      roles: ["admin"],
    },
    {
      title: "Contracts",
      href: "/dashboard/contracts",
      icon: FileCode,
      roles: ["admin", "client"],
    },
    {
      title: "Invoice Upload",
      href: "/dashboard/invoice-upload",
      icon: Upload,
      roles: ["admin"],
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
    },
    {
      title: "Inventory",
      href: "/dashboard/inventory",
      icon: Package,
      roles: ["admin", "staff"],
    },
    {
      title: "Materials",
      href: "/dashboard/materials",
      icon: Truck,
      roles: ["admin", "staff"],
    },
    {
      title: "Payroll",
      href: "/dashboard/payroll",
      icon: DollarSign,
      roles: ["admin"],
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      roles: ["admin", "staff", "client"],
    },
  ]

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole))

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle>
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary">
                <span className="font-bold text-primary-foreground">TF</span>
              </div>
              <span className="font-bold">TradesFlow</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="flex flex-col gap-1 p-2">
            {filteredNavItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
            <div className="mt-4 border-t pt-4">
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-accent"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
