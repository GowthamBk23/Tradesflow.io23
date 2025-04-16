"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Info, UserPlus, Phone, Video, ChevronLeft, Mic, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import type { Chat, ChatMessage } from "./chat-layout"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { VoiceRecorder } from "./voice-recorder"
import { CallModal } from "./call-modal"
import { supabase } from "@/lib/supabase"
import { webRTCService, type CallType } from "@/lib/webrtc-service"
import { useToast } from "@/hooks/use-toast"
import ChatMessageList from "./chat-message-list"

interface ChatWindowProps {
  chat: Chat
  messages: ChatMessage[]
  onSendMessage: (content: string, attachments?: any[], isVoiceNote?: boolean, voiceNoteDuration?: number) => void
  onToggleInfoPanel: () => void
  showInfoPanel: boolean
  onBack: () => void
  currentUserId: string
  onStartCall?: (type: "audio" | "video") => void
  activeCall?: "audio" | "video"
  onEndCall?: () => void
  onAddPersonToChat: () => void
}

export default function ChatWindow({
  chat,
  messages,
  onSendMessage,
  onToggleInfoPanel,
  showInfoPanel,
  onBack,
  currentUserId,
  onStartCall,
  activeCall,
  onEndCall,
  onAddPersonToChat,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("")
  const isMobile = useMobile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [playingVoiceNoteId, setPlayingVoiceNoteId] = useState<string | null>(null)
  const [callModalOpen, setCallModalOpen] = useState(false)
  const [incomingCall, setIncomingCall] = useState<{
    type: CallType
    callerName: string
  } | null>(null)
  const [currentCallType, setCurrentCallType] = useState<CallType | null>(null)
  const { toast } = useToast()
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})
  const channelRef = useRef<any>(null)

  // Set up Supabase Realtime channel for this chat
  useEffect(() => {
    if (!chat.id || !currentUserId) return

    // Create a channel for this chat
    const channel = supabase
      .channel(`chat-${chat.id}`)
      .on("broadcast", { event: "new_message" }, (payload) => {
        // Handle new message
        if (payload.payload.senderId !== currentUserId) {
          const newMessage = payload.payload as ChatMessage

          // Add the message to the list
          onSendMessage(
            newMessage.content,
            newMessage.attachments,
            newMessage.isVoiceNote,
            newMessage.voiceNoteDuration,
          )
        }
      })
      .subscribe()

    channelRef.current = channel

    // Set up WebRTC service for calls
    webRTCService.joinChannel(chat.id, currentUserId)

    // Listen for call events
    const handleCallEvent = (event: any) => {
      if (event.type === "offer") {
        // Handle incoming call
        setIncomingCall({
          type: event.callType,
          callerName: event.callerName,
        })
        setCallModalOpen(true)
      } else if (event.type === "call-ended" || event.type === "call-rejected") {
        // Handle call ended
        setCallModalOpen(false)
        setCurrentCallType(null)
        setIncomingCall(null)
      }
    }

    webRTCService.addEventListener(handleCallEvent)

    return () => {
      // Clean up
      supabase.removeChannel(channel)
      webRTCService.leaveChannel()
      webRTCService.removeEventListener(handleCallEvent)
    }
  }, [chat.id, currentUserId, onSendMessage])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Send message via Supabase channel
      channelRef.current?.send({
        type: "broadcast",
        event: "new_message",
        payload: {
          id: `msg_${Date.now()}`,
          senderId: currentUserId,
          content: messageInput.trim(),
          timestamp: new Date(),
          read: false,
        } as ChatMessage,
      })

      onSendMessage(messageInput.trim())
      setMessageInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        const attachments = []

        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Upload file to Supabase Storage
          const fileName = `${Date.now()}_${file.name}`
          const { data, error } = await supabase.storage.from("chat-attachments").upload(`${chat.id}/${fileName}`, file)

          if (error) throw error

          // Get public URL
          const { data: urlData } = supabase.storage.from("chat-attachments").getPublicUrl(`${chat.id}/${fileName}`)

          attachments.push({
            id: `att_${Date.now()}_${i}`,
            name: file.name,
            type: file.type,
            url: urlData.publicUrl,
            size: file.size,
          })
        }

        // Send message with attachments
        channelRef.current?.send({
          type: "broadcast",
          event: "new_message",
          payload: {
            id: `msg_${Date.now()}`,
            senderId: currentUserId,
            content: `Sent ${files.length} file${files.length > 1 ? "s" : ""}`,
            timestamp: new Date(),
            read: false,
            attachments,
          } as ChatMessage,
        })

        onSendMessage(`Sent ${files.length} file${files.length > 1 ? "s" : ""}`, attachments)

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        console.error("Error uploading file:", error)
        toast({
          title: "Error uploading file",
          description: "Please try again later",
          variant: "destructive",
        })
      }
    }
  }

  const startVoiceRecording = () => {
    setIsRecordingVoice(true)
  }

  const handleSendVoiceNote = async (audioBlob: Blob) => {
    try {
      // Upload audio to Supabase Storage
      const fileName = `voice_${Date.now()}.webm`
      const { data, error } = await supabase.storage.from("voice-notes").upload(`${chat.id}/${fileName}`, audioBlob)

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage.from("voice-notes").getPublicUrl(`${chat.id}/${fileName}`)

      // Calculate duration (approximate)
      const audioDuration = Math.round(audioBlob.size / 1000) // Rough estimate

      // Send voice note message
      channelRef.current?.send({
        type: "broadcast",
        event: "new_message",
        payload: {
          id: `msg_${Date.now()}`,
          senderId: currentUserId,
          content: "Voice message",
          timestamp: new Date(),
          read: false,
          isVoiceNote: true,
          voiceNoteDuration: audioDuration,
          attachments: [
            {
              id: `voice_${Date.now()}`,
              name: fileName,
              type: "audio/webm",
              url: urlData.publicUrl,
              size: audioBlob.size,
            },
          ],
        } as ChatMessage,
      })

      onSendMessage(
        "Voice message",
        [
          {
            id: `voice_${Date.now()}`,
            name: fileName,
            type: "audio/webm",
            url: urlData.publicUrl,
            size: audioBlob.size,
          },
        ],
        true,
        audioDuration,
      )

      setIsRecordingVoice(false)
    } catch (error) {
      console.error("Error uploading voice note:", error)
      toast({
        title: "Error uploading voice note",
        description: "Please try again later",
        variant: "destructive",
      })
      setIsRecordingVoice(false)
    }
  }

  const cancelVoiceRecording = () => {
    setIsRecordingVoice(false)
  }

  const togglePlayVoiceNote = (messageId: string, attachmentUrl?: string) => {
    if (!attachmentUrl) return

    if (playingVoiceNoteId === messageId) {
      // Pause the audio
      if (audioRefs.current[messageId]) {
        audioRefs.current[messageId].pause()
      }
      setPlayingVoiceNoteId(null)
    } else {
      // Pause any currently playing audio
      if (playingVoiceNoteId && audioRefs.current[playingVoiceNoteId]) {
        audioRefs.current[playingVoiceNoteId].pause()
      }

      // Play the new audio
      if (!audioRefs.current[messageId]) {
        // Create audio element if it doesn't exist
        audioRefs.current[messageId] = new Audio(attachmentUrl)
        audioRefs.current[messageId].addEventListener("ended", () => {
          setPlayingVoiceNoteId(null)
        })
      }

      audioRefs.current[messageId].play()
      setPlayingVoiceNoteId(messageId)
    }
  }

  // Get chat display name
  const getChatDisplayName = () => {
    if (chat.name) return chat.name

    const otherParticipants = chat.participants.filter((p) => p.id !== currentUserId)
    if (otherParticipants.length === 1) {
      return otherParticipants[0].name
    }

    return otherParticipants.map((p) => p.name.split(" ")[0]).join(", ")
  }

  // Get avatar for chat
  const getChatAvatar = () => {
    if (!chat.isGroup) {
      const otherParticipant = chat.participants.find((p) => p.id !== currentUserId)
      return otherParticipant?.avatar
    }
    return undefined
  }

  // Get initials for avatar fallback
  const getAvatarInitials = () => {
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

  // Get participant status
  const getParticipantStatus = () => {
    if (chat.isGroup) {
      return `${chat.participants.length} participants`
    }

    const otherParticipant = chat.participants.find((p) => p.id !== currentUserId)
    return otherParticipant?.status === "online" ? "Online" : "Offline"
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Handle starting a call
  const handleStartCall = async (type: CallType) => {
    try {
      setCurrentCallType(type)
      setCallModalOpen(true)

      // Get the other participant's name for display
      const otherParticipant = chat.participants.find((p) => p.id !== currentUserId)
      const userName = otherParticipant ? otherParticipant.name : "User"

      // Start the call
      await webRTCService.startCall(type, currentUserId, userName)
    } catch (error) {
      console.error("Error starting call:", error)
      toast({
        title: "Error starting call",
        description: "Could not access camera or microphone",
        variant: "destructive",
      })
      setCallModalOpen(false)
      setCurrentCallType(null)
    }
  }

  // Handle accepting an incoming call
  const handleAcceptCall = async () => {
    try {
      await webRTCService.answerCall(currentUserId)
      setCurrentCallType(incomingCall?.type || "audio")
      setIncomingCall(null)
    } catch (error) {
      console.error("Error accepting call:", error)
      toast({
        title: "Error accepting call",
        description: "Could not access camera or microphone",
        variant: "destructive",
      })
      webRTCService.rejectCall(currentUserId)
      setCallModalOpen(false)
      setIncomingCall(null)
    }
  }

  // Handle rejecting an incoming call
  const handleRejectCall = () => {
    webRTCService.rejectCall(currentUserId)
    setCallModalOpen(false)
    setIncomingCall(null)
  }

  // Handle ending a call
  const handleEndCall = () => {
    webRTCService.endCall()
    setCallModalOpen(false)
    setCurrentCallType(null)
  }

  return (
    <div className="flex flex-col h-full flex-1 bg-background/95">
      {/* Chat header */}
      <Card className="flex items-center justify-between p-4 rounded-none border-b">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <Avatar className={cn("h-10 w-10", chat.isGroup ? "bg-primary/20" : "bg-secondary/20")}>
            <AvatarImage src={getChatAvatar()} />
            <AvatarFallback>{chat.isGroup ? <Users className="h-5 w-5" /> : getAvatarInitials()}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-medium">{getChatDisplayName()}</h3>
            <p className="text-xs text-muted-foreground">{getParticipantStatus()}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            {!activeCall && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleStartCall("audio")}>
                      <Phone className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Audio Call</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleStartCall("video")}>
                      <Video className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Video Call</TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onAddPersonToChat}>
                  <UserPlus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add participant</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={showInfoPanel ? "secondary" : "ghost"} size="icon" onClick={onToggleInfoPanel}>
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Info</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Card>

      {/* Active call banner */}
      {activeCall && (
        <div className="bg-primary/10 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeCall === "audio" ? (
              <Phone className="h-4 w-4 text-primary" />
            ) : (
              <Video className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm">{activeCall === "audio" ? "Audio" : "Video"} call in progress</span>
          </div>
          <Button variant="destructive" size="sm" onClick={onEndCall}>
            End Call
          </Button>
        </div>
      )}

      {/* Messages area */}
      <ChatMessageList messages={messages} chat={chat} currentUserId={currentUserId} />

      {/* Message input */}
      <Card className="p-4 rounded-none border-t">
        {isRecordingVoice ? (
          <VoiceRecorder onSend={handleSendVoiceNote} onCancel={cancelVoiceRecording} />
        ) : (
          <div className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />

            <Button variant="ghost" size="icon" className="shrink-0" onClick={handleFileUpload}>
              <Paperclip className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="shrink-0" onClick={startVoiceRecording}>
              <Mic className="h-5 w-5" />
            </Button>

            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />

            <Button
              variant="primary"
              size="icon"
              className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </Card>

      {/* Call Modal */}
      <CallModal
        isOpen={callModalOpen}
        onClose={handleEndCall}
        callType={currentCallType || incomingCall?.type || "audio"}
        isIncoming={!!incomingCall}
        callerName={incomingCall?.callerName}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </div>
  )
}
