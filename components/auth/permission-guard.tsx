"use client"

import type { ReactNode } from "react"
import { useUser } from "@/contexts/user-context"

interface PermissionGuardProps {
  permission: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
  const { hasPermission } = useUser()

  if (hasPermission(permission)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
