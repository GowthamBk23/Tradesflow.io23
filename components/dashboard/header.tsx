"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Settings, User, LogOut, Shield } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationsDropdown } from "./notifications-dropdown"
import { useToast } from "@/hooks/use-toast"
import { useUser, type UserRole } from "@/contexts/user-context"

interface HeaderProps {
  isMobile: boolean
  setMobileNavOpen: (open: boolean) => void
  userName: string
  userAvatar: string
  userRole: UserRole
}

export function Header({ isMobile, setMobileNavOpen, userName, userAvatar, userRole }: HeaderProps) {
  const { toast } = useToast()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { switchRole } = useUser()

  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()

  const handleProfileClick = () => {
    toast({
      title: "Viewing profile",
      description: "Redirecting to profile page...",
    })
    setDropdownOpen(false)
    window.location.href = "/dashboard/settings"
  }

  const handleSettingsClick = () => {
    toast({
      title: "Viewing settings",
      description: "Redirecting to settings page...",
    })
    setDropdownOpen(false)
    window.location.href = "/dashboard/settings"
  }

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "You have been logged out successfully.",
    })
    setDropdownOpen(false)
    window.location.href = "/auth"
  }

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role)
    toast({
      title: `Switched to ${role} role`,
      description: `You are now viewing the dashboard as a ${role}.`,
    })
    setDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-card/50 backdrop-blur-sm px-4 md:px-6">
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-2xl"
          onClick={() => {
            setMobileNavOpen(true)
            toast({
              title: "Menu opened",
              description: "Mobile navigation menu opened.",
            })
          }}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}

      {/* Breadcrumbs or Page Title - visible on desktop */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
          TradesFlow
        </span>
        <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        <ModeToggle />

        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Profile Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-2xl flex items-center gap-2 pl-2 pr-3">
              <Avatar className="h-8 w-8 rounded-2xl">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="rounded-2xl">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block font-medium">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            {/* Role Switcher - for demo purposes */}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Switch Role (Demo)</span>
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer"
              onClick={() => handleRoleSwitch("admin")}
              disabled={userRole === "admin"}
            >
              Switch to Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer"
              onClick={() => handleRoleSwitch("staff")}
              disabled={userRole === "staff"}
            >
              Switch to Staff
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl cursor-pointer"
              onClick={() => handleRoleSwitch("client")}
              disabled={userRole === "client"}
            >
              Switch to Client
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-xl cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
