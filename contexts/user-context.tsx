"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define user types
export type UserRole = "admin" | "staff" | "client"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  companyId?: string
  teamId?: string
  clientId?: string
  permissions: string[]
}

// Define permissions for each role
const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "view:all",
    "create:all",
    "edit:all",
    "delete:all",
    "manage:users",
    "manage:billing",
    "manage:settings",
    "view:reports",
    "manage:inventory",
  ],
  staff: [
    "view:own",
    "create:own",
    "edit:own",
    "view:team",
    "view:inventory",
    "manage:inventory",
    "log:time",
    "view:documents",
    "upload:documents",
  ],
  client: ["view:own", "view:contracts", "view:invoices", "view:documents", "manage:profile", "create:support"],
}

// Mock users for different roles
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: "admin-1",
    name: "Admin User",
    email: "admin@tradesflow.com",
    role: "admin",
    avatar: "/placeholder.svg?height=32&width=32",
    companyId: "company-1",
    permissions: rolePermissions.admin,
  },
  staff: {
    id: "staff-1",
    name: "Staff Member",
    email: "staff@tradesflow.com",
    role: "staff",
    avatar: "/placeholder.svg?height=32&width=32",
    companyId: "company-1",
    teamId: "team-1",
    permissions: rolePermissions.staff,
  },
  client: {
    id: "client-1",
    name: "Client User",
    email: "client@example.com",
    role: "client",
    avatar: "/placeholder.svg?height=32&width=32",
    clientId: "client-1",
    permissions: rolePermissions.client,
  },
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  switchRole: (role: UserRole) => void
  hasPermission: (permission: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUser(mockUsers[currentRole])
      setIsLoading(false)
    }

    loadUser()
  }, [currentRole])

  // Function to switch between roles for testing
  const switchRole = (role: UserRole) => {
    setCurrentRole(role)
  }

  // Function to check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    // Admin has all permissions
    if (user.role === "admin") return true

    // Check if the user has the specific permission
    return user.permissions.includes(permission)
  }

  return <UserContext.Provider value={{ user, isLoading, switchRole, hasPermission }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
