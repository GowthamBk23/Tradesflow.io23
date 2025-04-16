"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Users, User } from "lucide-react"
import type { Chat } from "./chat-layout"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface ChatSidebarProps {
  chats: Chat[]
  selectedChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onCreateGroup: () => void
  onCreateIndividual: () => void
  currentUserId: string
  currentUserRole: "admin" | "staff" | "client"
  isLoading?: boolean
}

export default function ChatSidebar({
  chats,
  selectedChat,
  onSelectChat,
  onCreateGroup,
  onCreateIndividual,
  currentUserId,
  currentUserRole,
  isLoading = false,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    const chatName = chat.name || chat.participants.find((p) => p.id !== currentUserId)?.name || ""
    return chatName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Get chat display name
  const getChatDisplayName = (chat: Chat) => {
    if (chat.name) return chat.name

    const otherParticipant = chat.participants.find((p) => p.id !== currentUserId)
    return otherParticipant?.name || "Chat"
  }

  // Get chat avatar
  const getChatAvatar = (chat: Chat) => {
    if (!chat.isGroup) {
      const otherParticipant = chat.participants.find((p) => p.id !== currentUserId)
      return otherParticipant?.avatar
    }
    return undefined
  }

  // Get initials for avatar fallback
  const getAvatarInitials = (chat: Chat) => {
    if (chat.name) {
      return chat.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    const otherParticipant = chat.participants.find((p) => p.id !== currentUserId)
    if (otherParticipant) {
      return otherParticipant.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    return "CH"
  }

  // Get last message preview
  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return "No messages yet"

    if (chat.lastMessage.isVoiceNote) {
      return "Voice message"
    }

    if (chat.lastMessage.attachments && chat.lastMessage.attachments.length > 0) {
      return chat.lastMessage.content
    }

    return chat.lastMessage.content.length > 30
      ? chat.lastMessage.content.substring(0, 30) + "..."
      : chat.lastMessage.content
  }

  // Get last message time
  const getLastMessageTime = (chat: Chat) => {
    if (!chat.lastMessage) return ""

    const now = new Date()
    const messageDate = new Date(chat.lastMessage.timestamp)

    // If the message is from today, show the time
    if (
      now.getDate() === messageDate.getDate() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getFullYear() === messageDate.getFullYear()
    ) {
      return format(messageDate, "h:mm a")
    }

    // If the message is from this week, show the day
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return format(messageDate, "EEE")
    }

    // Otherwise, show the date
    return format(messageDate, "MMM d")
  }

  return (
    <div className="w-full md:w-80 border-r flex flex-col h-full bg-card/50">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Messages</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Create new chat buttons */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1 justify-start" onClick={onCreateIndividual}>
            <User className="h-4 w-4 mr-2" />
            <span>New Chat</span>
          </Button>
          <Button variant="outline" className="flex-1 justify-start" onClick={onCreateGroup}>
            <Users className="h-4 w-4 mr-2" />
            <span>New Group</span>
          </Button>
        </div>
      </div>

      {/* Chat list */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          // Loading skeletons
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="p-2">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                className={cn(
                  "w-full text-left p-3 rounded-lg mb-1 transition-colors",
                  selectedChat?.id === chat.id ? "bg-primary/10 text-primary" : "hover:bg-muted/50",
                )}
                onClick={() => onSelectChat(chat)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className={cn("h-12 w-12", chat.isGroup ? "bg-primary/20" : "bg-secondary/20")}>
                      <AvatarImage src={getChatAvatar(chat)} />
                      <AvatarFallback>
                        {chat.isGroup ? <Users className="h-6 w-6" /> : getAvatarInitials(chat)}
                      </AvatarFallback>
                    </Avatar>
                    {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{getChatDisplayName(chat)}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {getLastMessageTime(chat)}
                      </span>
                    </div>
                    <p
                      className={cn("text-sm truncate", chat.unreadCount > 0 ? "font-medium" : "text-muted-foreground")}
                    >
                      {getLastMessagePreview(chat)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
