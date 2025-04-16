"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, UserPlus, Check } from "lucide-react"
import type { Chat, ChatUser } from "./chat-layout"

interface AddPersonToChatModalProps {
  chat: Chat
  users: ChatUser[]
  onClose: () => void
  onAddPerson: (chatId: string, userId: string) => void
  currentUserRole: "admin" | "staff" | "client"
}

export default function AddPersonToChatModal({
  chat,
  users,
  onClose,
  onAddPerson,
  currentUserRole,
}: AddPersonToChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Filter out users who are already in the chat
  const availableUsers = users.filter((user) => !chat.participants.some((participant) => participant.id === user.id))

  // Filter users based on search query
  const filteredUsers = availableUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Check if a user can be added based on current user's role and the user's role
  const canAddUser = (user: ChatUser) => {
    if (currentUserRole === "admin") {
      // Admins can add anyone
      return true
    } else if (currentUserRole === "staff") {
      // Staff can only add other staff and admins
      return user.role === "admin" || user.role === "staff"
    } else {
      // Clients can only add admins
      return user.role === "admin"
    }
  }

  const handleAddPerson = () => {
    if (selectedUserId) {
      onAddPerson(chat.id, selectedUserId)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Person to Chat</DialogTitle>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="max-h-[300px] overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {availableUsers.length === 0
                ? "All users are already in this chat"
                : "No users found matching your search"}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isDisabled = !canAddUser(user)
                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      selectedUserId === user.id
                        ? "bg-primary/10"
                        : isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-muted/50 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedUserId(selectedUserId === user.id ? null : user.id)
                      }
                    }}
                  >
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage src={user.avatar || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.role === "client" && user.company
                          ? user.company
                          : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </div>
                    {selectedUserId === user.id ? (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <UserPlus className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddPerson} disabled={!selectedUserId}>
            Add to Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
