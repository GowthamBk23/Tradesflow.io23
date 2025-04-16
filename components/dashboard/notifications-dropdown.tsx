"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Check, CheckCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Sample notification data
const initialNotifications = [
  {
    id: "1",
    title: "New project assigned",
    description: "You've been assigned to the Kitchen Renovation project",
    time: "10 minutes ago",
    read: false,
    type: "project",
    link: "/dashboard/projects",
  },
  {
    id: "2",
    title: "Schedule update",
    description: "Your schedule for next week has been updated",
    time: "1 hour ago",
    read: false,
    type: "schedule",
    link: "/dashboard/schedule",
  },
  {
    id: "3",
    title: "Material request approved",
    description: "Your request for additional lumber has been approved",
    time: "3 hours ago",
    read: false,
    type: "materials",
    link: "/dashboard/materials",
  },
  {
    id: "4",
    title: "Invoice paid",
    description: "Client has paid invoice #INV-2023-004",
    time: "Yesterday",
    read: true,
    type: "invoice",
    link: "/dashboard/invoices",
  },
]

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string, link: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )

    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })

    // Use window.location for direct navigation
    if (link) {
      window.location.href = link
    }

    setOpen(false)
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const viewAllNotifications = () => {
    toast({
      title: "View all notifications",
      description: "This would navigate to a full notifications page in a real app.",
    })
    setOpen(false)
  }

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed.",
    })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl relative"
          onClick={() => {
            if (!open) {
              setOpen(true)
            }
          }}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications ({unreadCount} unread)</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                markAllAsRead()
              }}
            >
              <CheckCheck className="h-3 w-3" />
              <span>Mark all as read</span>
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 cursor-pointer relative group ${notification.read ? "opacity-70" : "font-medium"}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  markAsRead(notification.id, notification.link)
                }}
              >
                <div className="flex justify-between w-full">
                  <span className="text-sm">{notification.title}</span>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-primary"></span>}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{notification.description}</span>
                <span className="text-xs text-muted-foreground mt-2">{notification.time}</span>

                {/* Dismiss button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    dismissNotification(notification.id, e)
                  }}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Dismiss</span>
                </Button>

                {/* Mark as read button */}
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      markAsRead(notification.id, "")
                    }}
                  >
                    <Check className="h-3 w-3" />
                    <span className="sr-only">Mark as read</span>
                  </Button>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-xl cursor-pointer justify-center text-center"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            viewAllNotifications()
          }}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
