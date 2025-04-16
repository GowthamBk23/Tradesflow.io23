"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Download, ArrowDown, ArrowUp, Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Chat, ChatMessage } from "./chat-layout"
import { AudioWaveform } from "./audio-waveform"

interface ChatMessageListProps {
  messages: ChatMessage[]
  chat: Chat
  currentUserId: string
}

export default function ChatMessageList({ messages, chat, currentUserId }: ChatMessageListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [playingVoiceNoteId, setPlayingVoiceNoteId] = useState<string | null>(null)

  // Scroll to bottom on initial load and when new messages arrive
  useEffect(() => {
    if (messages.length === 0) return

    if (isNearBottom) {
      scrollToBottom()
    }
  }, [messages, isNearBottom])

  // Set up scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container

      // Show scroll to bottom button when not at bottom
      const bottomThreshold = 100
      const isNearBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold
      setShowScrollToBottom(!isNearBottom)
      setIsNearBottom(isNearBottom)

      // Show scroll to top button when not at top
      const topThreshold = 100
      setShowScrollToTop(scrollTop > topThreshold)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }

  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlayVoiceNote = (messageId: string) => {
    if (playingVoiceNoteId === messageId) {
      setPlayingVoiceNoteId(null)
    } else {
      setPlayingVoiceNoteId(messageId)
    }
  }

  // Group messages by date
  const groupedMessages: { [key: string]: ChatMessage[] } = {}
  messages.forEach((message) => {
    const date = format(message.timestamp, "EEE, d MMM")
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <div ref={messagesContainerRef} id="chat-messages-container" className="flex-1 overflow-y-auto p-4 relative">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="text-center my-4">
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">{date}</span>
          </div>

          {dateMessages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId
            const sender = chat.participants.find((p) => p.id === message.senderId)
            const isPlaying = playingVoiceNoteId === message.id

            return (
              <div
                key={message.id}
                className={cn("mb-4", isCurrentUser ? "flex flex-col items-end" : "flex flex-col items-start")}
              >
                {!isCurrentUser && chat.isGroup && (
                  <span className="text-xs text-muted-foreground ml-12 mb-1">{sender?.name}</span>
                )}

                <div className="flex items-start gap-2">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="text-xs">
                        {sender?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[75%]",
                      isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                      "rounded-lg px-3 py-2",
                    )}
                  >
                    {message.isVoiceNote ? (
                      <div className="flex items-center gap-2 py-1 min-w-[180px]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full shrink-0"
                          onClick={() => togglePlayVoiceNote(message.id)}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>

                        <div className="flex-1 flex flex-col gap-1">
                          <AudioWaveform isPlaying={isPlaying} className="w-full h-8" />
                          <div className="text-xs opacity-80 text-right">
                            {message.voiceNoteDuration ? formatDuration(message.voiceNoteDuration) : "00:00"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}

                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center gap-2 p-2 bg-background/20 rounded-md mt-1"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{attachment.name}</p>
                              <p className="text-xs opacity-70">{formatFileSize(attachment.size || 0)}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span className={cn("text-xs text-muted-foreground mt-1", isCurrentUser ? "mr-2" : "ml-12")}>
                  {format(message.timestamp, "HH:mm")}
                </span>
              </div>
            )
          })}
        </div>
      ))}

      {/* Scroll buttons */}
      {showScrollToBottom && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full shadow-md"
          onClick={scrollToBottom}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}

      {showScrollToTop && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 rounded-full shadow-md"
          onClick={scrollToTop}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
