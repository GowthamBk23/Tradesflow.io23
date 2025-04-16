"use client"

import { X, Users, User, Phone, Video, Bell, BellOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import type { Chat } from "./chat-layout"
import { cn } from "@/lib/utils"

interface ChatInfoPanelProps {
  chat: Chat
  onClose: () => void
}

export default function ChatInfoPanel({ chat, onClose }: ChatInfoPanelProps) {
  return (
    <div className="w-full md:w-80 lg:w-96 border-l border-border bg-card flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Chat Info</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex flex-col items-center">
        <Avatar className={cn("h-20 w-20 mb-4", chat.isGroup ? "bg-primary/20" : "bg-secondary/20")}>
          <AvatarImage src={!chat.isGroup ? chat.participants[1]?.avatar : undefined} />
          <AvatarFallback>
            {chat.isGroup ? (
              <Users className="h-10 w-10" />
            ) : (
              chat.participants[1]?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            )}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-xl font-semibold">
          {chat.name ||
            (chat.isGroup ? chat.participants.map((p) => p.name.split(" ")[0]).join(", ") : chat.participants[1]?.name)}
        </h2>

        {!chat.isGroup && chat.participants[1]?.company && (
          <p className="text-sm text-muted-foreground mb-2">{chat.participants[1].company}</p>
        )}

        {!chat.isGroup && (
          <Badge variant="outline" className="mb-4">
            {chat.participants[1]?.role.charAt(0).toUpperCase() + chat.participants[1]?.role.slice(1)}
          </Badge>
        )}

        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Video className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span>Notifications</span>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            <span>Mute mentions</span>
          </div>
          <Switch />
        </div>
      </div>

      <Separator />

      <div className="p-4">
        <h3 className="font-semibold mb-3">{chat.isGroup ? "Participants" : "Contact Info"}</h3>

        {!chat.isGroup && chat.participants[1]?.email && (
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{chat.participants[1].email}</p>
          </div>
        )}

        {!chat.isGroup && chat.participants[1]?.phone && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{chat.participants[1].phone}</p>
          </div>
        )}

        {chat.isGroup && (
          <div className="space-y-2">
            {chat.participants.map((participant) => (
              <Card key={participant.id} className="p-2 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback>
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{participant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {participant.role.charAt(0).toUpperCase() + participant.role.slice(1)}
                    {participant.status === "online" && " • Online"}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <User className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div className="p-4 mt-auto">
        <Button variant="destructive" className="w-full">
          {chat.isGroup ? "Leave Group" : "Block Contact"}
        </Button>
      </div>
    </div>
  )
}
