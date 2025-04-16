"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"
import ChatInfoPanel from "./chat-info-panel"
import CreateGroupChatModal from "./create-group-chat-modal"
import CreateIndividualChatModal from "./create-individual-chat-modal"
import AddPersonToChatModal from "./add-person-to-chat-modal"
import { useMobile } from "@/hooks/use-mobile"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { webRTCService } from "@/lib/webrtc-service"

// Mock data types
export type ChatUser = {
  id: string
  name: string
  avatar?: string
  role: "admin" | "staff" | "client"
  status?: "online" | "offline" | "away"
  company?: string
  email?: string
  phone?: string
  sites?: string[] // Sites/projects the user is assigned to
}

export type ChatMessage = {
  id: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: {
    id: string
    name: string
    type: string
    url: string
    size?: number
  }[]
  isVoiceNote?: boolean
  voiceNoteDuration?: number
}

export type Chat = {
  id: string
  name?: string
  participants: ChatUser[]
  isGroup: boolean
  lastMessage?: ChatMessage
  unreadCount: number
}

// Mock data
const mockUsers: ChatUser[] = [
  {
    id: "user1",
    name: "John Smith",
    role: "admin",
    status: "online",
    email: "john@tradesflow.com",
    phone: "(555) 123-4567",
    sites: ["site1", "site2", "site3"],
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    role: "staff",
    status: "online",
    email: "sarah@tradesflow.com",
    phone: "(555) 234-5678",
    sites: ["site1", "site2"],
  },
  {
    id: "user3",
    name: "Mike Williams",
    role: "client",
    company: "Williams Construction",
    status: "offline",
    email: "mike@williamsconstruction.com",
    phone: "(555) 345-6789",
    sites: ["site1"],
  },
  {
    id: "user4",
    name: "Emily Davis",
    role: "client",
    company: "Davis Homes",
    status: "away",
    email: "emily@davishomes.com",
    phone: "(555) 456-7890",
    sites: ["site2"],
  },
  {
    id: "user5",
    name: "Robert Taylor",
    role: "staff",
    status: "offline",
    email: "robert@tradesflow.com",
    phone: "(555) 567-8901",
    sites: ["site3"],
  },
  {
    id: "user6",
    name: "Jessica Brown",
    role: "client",
    company: "Brown Renovations",
    status: "online",
    email: "jessica@brownrenovations.com",
    phone: "(555) 678-9012",
    sites: ["site3"],
  },
]

// Function to get filtered chats based on user role
const getFilteredChats = (currentUser: ChatUser): Chat[] => {
  // Admin can see all chats
  if (currentUser.role === "admin") {
    return [
      {
        id: "chat1",
        participants: [currentUser, mockUsers[2]], // Admin to Client
        isGroup: false,
        unreadCount: 2,
        lastMessage: {
          id: "msg1",
          senderId: "user3",
          content: "When can we expect the updated quote?",
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          read: false,
        },
      },
      {
        id: "chat2",
        participants: [currentUser, mockUsers[1]], // Admin to Staff
        isGroup: false,
        unreadCount: 0,
        lastMessage: {
          id: "msg2",
          senderId: "user1",
          content: "Please update the project timeline",
          timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          read: true,
        },
      },
      {
        id: "chat3",
        name: "Project Alpha Team",
        participants: [currentUser, mockUsers[1], mockUsers[4]], // Admin with Staff
        isGroup: true,
        unreadCount: 5,
        lastMessage: {
          id: "msg3",
          senderId: "user2",
          content: "Let's meet at the site at 9am.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
        },
      },
      {
        id: "chat4",
        participants: [currentUser, mockUsers[5]], // Admin to Client
        isGroup: false,
        unreadCount: 0,
        lastMessage: {
          id: "msg4",
          senderId: "user1",
          content: "The permits have been approved.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
        },
      },
      {
        id: "chat5",
        name: "Davis Homes Project",
        participants: [currentUser, mockUsers[1], mockUsers[3]], // Admin, Staff, Client
        isGroup: true,
        unreadCount: 0,
        lastMessage: {
          id: "msg5",
          senderId: "user3",
          content: "I've attached the updated floor plans.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
          read: true,
          attachments: [
            {
              id: "att1",
              name: "floor_plans_v2.pdf",
              type: "application/pdf",
              url: "#",
              size: 2400000,
            },
          ],
        },
      },
    ]
  }

  // Staff can only chat with other staff and admins
  else if (currentUser.role === "staff") {
    const staffChats: Chat[] = []

    // Add chats with admins
    const admins = mockUsers.filter((u) => u.role === "admin")
    admins.forEach((admin) => {
      staffChats.push({
        id: `chat_${admin.id}_${currentUser.id}`,
        participants: [currentUser, admin],
        isGroup: false,
        unreadCount: 0,
        lastMessage: {
          id: `msg_${admin.id}_${currentUser.id}`,
          senderId: admin.id,
          content: "How is the project progressing?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * Math.random() * 24),
          read: true,
        },
      })
    })

    // Add chats with other staff on same sites
    const otherStaff = mockUsers.filter(
      (u) =>
        u.role === "staff" && u.id !== currentUser.id && u.sites?.some((site) => currentUser.sites?.includes(site)),
    )

    otherStaff.forEach((staff) => {
      staffChats.push({
        id: `chat_${staff.id}_${currentUser.id}`,
        participants: [currentUser, staff],
        isGroup: false,
        unreadCount: Math.floor(Math.random() * 3),
        lastMessage: {
          id: `msg_${staff.id}_${currentUser.id}`,
          senderId: staff.id,
          content: "Can you help with the installation tomorrow?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * Math.random() * 12),
          read: Math.random() > 0.5,
        },
      })
    })

    // Add staff-only group chats for each site
    currentUser.sites?.forEach((site) => {
      const siteStaff = mockUsers.filter(
        (u) => u.role === "staff" && u.sites?.includes(site) && u.id !== currentUser.id,
      )
      const siteAdmins = mockUsers.filter((u) => u.role === "admin")

      if (siteStaff.length > 0 || siteAdmins.length > 0) {
        staffChats.push({
          id: `group_staff_${site}`,
          name: `Site ${site.replace("site", "")} Team`,
          participants: [currentUser, ...siteStaff, ...siteAdmins],
          isGroup: true,
          unreadCount: Math.floor(Math.random() * 5),
          lastMessage: {
            id: `msg_group_${site}`,
            senderId: siteStaff.length > 0 ? siteStaff[0].id : siteAdmins[0].id,
            content: "Updates for today's work completed.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * Math.random() * 8),
            read: Math.random() > 0.5,
          },
        })
      }
    })

    return staffChats
  }

  // Client can only chat with admins
  else {
    const clientChats: Chat[] = []

    // Add chats with admins
    const admins = mockUsers.filter((u) => u.role === "admin")
    admins.forEach((admin) => {
      clientChats.push({
        id: `chat_${admin.id}_${currentUser.id}`,
        participants: [currentUser, admin],
        isGroup: false,
        unreadCount: 0,
        lastMessage: {
          id: `msg_${admin.id}_${currentUser.id}`,
          senderId: admin.id,
          content: "How are you liking the progress so far?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * Math.random() * 24),
          read: true,
        },
      })
    })

    // Add a project team group chat with admins only
    if (currentUser.sites && currentUser.sites.length > 0) {
      const projectAdmins = mockUsers.filter((u) => u.role === "admin")

      if (projectAdmins.length > 0) {
        clientChats.push({
          id: `project_team_${currentUser.id}`,
          name: `${currentUser.company || "Project"} Team`,
          participants: [currentUser, ...projectAdmins],
          isGroup: true,
          unreadCount: Math.floor(Math.random() * 5),
          lastMessage: {
            id: `msg_project_team_${currentUser.id}`,
            senderId: projectAdmins[0].id,
            content: "Weekly project update: We're on schedule.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * Math.random() * 48),
            read: Math.random() > 0.5,
          },
        })
      }
    }

    return clientChats
  }
}

// Mock messages for a selected chat
const getMockMessages = (chatId: string): ChatMessage[] => {
  // Generate a random number of messages between 5 and 15
  const messageCount = 5 + Math.floor(Math.random() * 10)
  const messages: ChatMessage[] = []

  // Get the participants from the chat ID
  const participantIds = chatId.includes("_")
    ? chatId.split("_").filter((id) => id.startsWith("user"))
    : ["user1", "user2"] // Default fallback

  // Generate messages with timestamps going back in time
  for (let i = 0; i < messageCount; i++) {
    const senderId = participantIds[i % participantIds.length]
    const hoursAgo = i * (1 + Math.random() * 2) // Increasing time gaps

    // Randomly add voice notes (10% chance)
    const isVoiceNote = Math.random() < 0.1

    messages.push({
      id: `msg_${chatId}_${i}`,
      senderId,
      content: isVoiceNote ? "Voice message" : getRandomMessage(i),
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * hoursAgo),
      read: true,
      ...(isVoiceNote && {
        isVoiceNote: true,
        voiceNoteDuration: Math.floor(Math.random() * 120) + 5, // 5-125 seconds
      }),
      ...(Math.random() > 0.8 &&
        !isVoiceNote && {
          attachments: [
            {
              id: `att_${chatId}_${i}`,
              name: getRandomAttachmentName(),
              type: getRandomAttachmentType(),
              url: "#",
              size: Math.floor(Math.random() * 5000000),
            },
          ],
        }),
    })
  }

  // Sort messages by timestamp (oldest first)
  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

// Helper functions for generating random content
function getRandomMessage(index: number): string {
  const messages = [
    "Hi there! How's the project coming along?",
    "We're making good progress on the site today.",
    "Can we schedule a meeting to discuss the timeline?",
    "I've sent over the updated materials list.",
    "The permits have been approved, we can start next week.",
    "There's a slight delay with the delivery, but we're working on it.",
    "The team will be on site tomorrow at 8am.",
    "Please review the attached document when you get a chance.",
    "We need to address the issue with the electrical work.",
    "Everything is on schedule for completion by the end of the month.",
    "The client is very happy with the progress so far.",
    "We might need additional materials for the extension.",
    "Weather forecast looks good for outdoor work next week.",
    "Can you confirm the measurements for the custom cabinets?",
    "The inspection is scheduled for Friday morning.",
  ]

  return messages[index % messages.length]
}

function getRandomAttachmentName(): string {
  const names = [
    "project_timeline.pdf",
    "site_photos.zip",
    "invoice_draft.pdf",
    "material_list.xlsx",
    "floor_plan_v2.pdf",
    "contract_amendment.docx",
    "progress_report.pdf",
    "installation_guide.pdf",
    "meeting_notes.docx",
    "budget_update.xlsx",
  ]

  return names[Math.floor(Math.random() * names.length)]
}

function getRandomAttachmentType(): string {
  const types = [
    "application/pdf",
    "application/zip",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ]

  return types[Math.floor(Math.random() * types.length)]
}

export default function ChatLayout() {
  const { user } = useUser()
  const isMobile = useMobile()
  const { toast } = useToast()

  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({})
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showCreateIndividualModal, setShowCreateIndividualModal] = useState(false)
  const [activeCall, setActiveCall] = useState<{ type: "audio" | "video"; chatId: string } | null>(null)
  const [showAddPersonModal, setShowAddPersonModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Create a mock current user based on the user context
  const currentUser: ChatUser = {
    id: user?.id || "user1",
    name: user?.name || "John Smith",
    role: (user?.role as "admin" | "staff" | "client") || "admin",
    status: "online",
    email: user?.email || "john@tradesflow.com",
    phone: "(555) 123-4567",
    company: user?.role === "client" ? "Client Company" : undefined,
    sites: ["site1", "site2", "site3"], // Mock assigned sites
  }

  // Initialize chats based on user role
  useEffect(() => {
    const loadChats = async () => {
      setIsLoading(true)

      try {
        // In a real app, we would fetch chats from Supabase here
        // const { data, error } = await supabase
        //   .from('chats')
        //   .select('*')
        //   .or(`participants.cs.{${currentUser.id}}`)

        // For now, we'll use our mock data
        const filteredChats = getFilteredChats(currentUser)
        setChats(filteredChats)

        // Pre-load messages for the first chat but don't auto-select on mobile
        if (filteredChats.length > 0) {
          const firstChatId = filteredChats[0].id

          // In a real app, we would fetch messages from Supabase here
          // const { data: messagesData, error: messagesError } = await supabase
          //   .from('messages')
          //   .select('*')
          //   .eq('chat_id', firstChatId)
          //   .order('timestamp', { ascending: true })

          // For now, we'll use our mock data
          setMessages({
            [firstChatId]: getMockMessages(firstChatId),
          })

          // Only auto-select chat on desktop or if we're restoring a previous selection
          if (!isMobile || localStorage.getItem("lastSelectedChatId") === firstChatId) {
            setSelectedChat(filteredChats[0])
          }
        }
      } catch (error) {
        console.error("Error loading chats:", error)
        toast({
          title: "Error loading chats",
          description: "Could not load your conversations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadChats()
  }, [isMobile, user, toast])

  // Set up Supabase Realtime subscription for messages
  useEffect(() => {
    if (!currentUser.id) return

    // Create a Supabase Realtime channel for messages
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${currentUser.id}`,
        },
        (payload) => {
          // Handle new message where current user is the recipient
          const newMessage = payload.new as any

          // Convert the database message to our ChatMessage format
          const chatMessage: ChatMessage = {
            id: newMessage.id,
            senderId: newMessage.sender_id,
            content: newMessage.content,
            timestamp: new Date(newMessage.timestamp),
            read: false,
            ...(newMessage.is_voice_note && {
              isVoiceNote: true,
              voiceNoteDuration: newMessage.voice_note_duration,
            }),
            ...(newMessage.attachments && {
              attachments: JSON.parse(newMessage.attachments),
            }),
          }

          // Update the messages state
          setMessages((prev) => {
            // If we already have messages for this chat, add the new one
            if (prev[newMessage.chat_id]) {
              return {
                ...prev,
                [newMessage.chat_id]: [...prev[newMessage.chat_id], chatMessage],
              }
            }
            // Otherwise, create a new array with just this message
            return {
              ...prev,
              [newMessage.chat_id]: [chatMessage],
            }
          })

          // Update the chat's last message and unread count
          setChats((prev) =>
            prev.map((chat) =>
              chat.id === newMessage.chat_id
                ? {
                    ...chat,
                    lastMessage: chatMessage,
                    unreadCount: chat.unreadCount + 1,
                  }
                : chat,
            ),
          )

          // Show a toast notification if the chat is not currently selected
          if (!selectedChat || selectedChat.id !== newMessage.chat_id) {
            const sender = mockUsers.find((u) => u.id === newMessage.sender_id) || { name: "Someone" }
            toast({
              title: `New message from ${sender.name}`,
              description: newMessage.is_voice_note
                ? "Voice message"
                : newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? "..." : ""),
            })
          }
        },
      )
      .subscribe()

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUser.id, selectedChat, toast])

  // Save last selected chat ID to localStorage
  useEffect(() => {
    if (selectedChat) {
      localStorage.setItem("lastSelectedChatId", selectedChat.id)
    }
  }, [selectedChat])

  // Load messages when selecting a chat
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat || messages[selectedChat.id]) return

      try {
        // In a real app, we would fetch messages from Supabase here
        // const { data, error } = await supabase
        //   .from('messages')
        //   .select('*')
        //   .eq('chat_id', selectedChat.id)
        //   .order('timestamp', { ascending: true })

        // For now, we'll use our mock data
        setMessages((prev) => ({
          ...prev,
          [selectedChat.id]: getMockMessages(selectedChat.id),
        }))

        // Mark messages as read
        // In a real app, we would update the read status in Supabase
        // await supabase
        //   .from('messages')
        //   .update({ read: true })
        //   .eq('chat_id', selectedChat.id)
        //   .eq('recipient_id', currentUser.id)
        //   .eq('read', false)

        // Update the unread count in the chat list
        setChats((prev) => prev.map((chat) => (chat.id === selectedChat.id ? { ...chat, unreadCount: 0 } : chat)))
      } catch (error) {
        console.error("Error loading messages:", error)
        toast({
          title: "Error loading messages",
          description: "Could not load conversation messages",
          variant: "destructive",
        })
      }
    }

    loadMessages()
  }, [selectedChat, messages, toast])

  const handleSendMessage = async (
    chatId: string,
    content: string,
    attachments?: any[],
    isVoiceNote?: boolean,
    voiceNoteDuration?: number,
  ) => {
    try {
      // Create the new message object
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        content,
        timestamp: new Date(),
        read: true,
        attachments,
        ...(isVoiceNote && { isVoiceNote, voiceNoteDuration }),
      }

      // In a real app, we would insert the message into Supabase
      // const { data, error } = await supabase
      //   .from('messages')
      //   .insert({
      //     chat_id: chatId,
      //     sender_id: currentUser.id,
      //     content,
      //     timestamp: new Date().toISOString(),
      //     read: false,
      //     is_voice_note: isVoiceNote || false,
      //     voice_note_duration: voiceNoteDuration,
      //     attachments: attachments ? JSON.stringify(attachments) : null,
      //   })

      // For now, we'll update our local state
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }))

      // Update last message in chat list
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, lastMessage: newMessage, unreadCount: 0 } : chat)),
      )
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleCreateGroupChat = async (name: string, participantIds: string[]) => {
    try {
      // Create participants array with current user and selected participants
      const participants = [currentUser, ...mockUsers.filter((user) => participantIds.includes(user.id))]

      // In a real app, we would insert the new chat into Supabase
      // const { data, error } = await supabase
      //   .from('chats')
      //   .insert({
      //     name,
      //     participants: participants.map(p => p.id),
      //     is_group: true,
      //     created_by: currentUser.id,
      //     created_at: new Date().toISOString(),
      //   })
      //   .select()

      // For now, we'll create a mock chat
      const newChat: Chat = {
        id: `chat_group_${Date.now()}`,
        name,
        participants,
        isGroup: true,
        unreadCount: 0,
      }

      setChats((prev) => [newChat, ...prev])
      setSelectedChat(newChat)
      setShowCreateGroupModal(false)
    } catch (error) {
      console.error("Error creating group chat:", error)
      toast({
        title: "Error creating group chat",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleCreateIndividualChat = async (participantId: string) => {
    try {
      // Check if chat already exists
      const existingChat = chats.find(
        (chat) =>
          !chat.isGroup &&
          chat.participants.length === 2 &&
          chat.participants.some((p) => p.id === participantId) &&
          chat.participants.some((p) => p.id === currentUser.id),
      )

      if (existingChat) {
        setSelectedChat(existingChat)
        setShowCreateIndividualModal(false)
        return
      }

      // Create a new individual chat
      const participant = mockUsers.find((user) => user.id === participantId)

      if (!participant) {
        console.error("Participant not found")
        setShowCreateIndividualModal(false)
        return
      }

      // In a real app, we would insert the new chat into Supabase
      // const { data, error } = await supabase
      //   .from('chats')
      //   .insert({
      //     participants: [currentUser.id, participantId],
      //     is_group: false,
      //     created_by: currentUser.id,
      //     created_at: new Date().toISOString(),
      //   })
      //   .select()

      // For now, we'll create a mock chat
      const newChat: Chat = {
        id: `chat_individual_${Date.now()}`,
        participants: [currentUser, participant],
        isGroup: false,
        unreadCount: 0,
      }

      setChats((prev) => [newChat, ...prev])
      setSelectedChat(newChat)
      setShowCreateIndividualModal(false)
    } catch (error) {
      console.error("Error creating individual chat:", error)
      toast({
        title: "Error creating chat",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleStartCall = async (type: "audio" | "video") => {
    if (!selectedChat) return

    try {
      // Set up WebRTC call
      await webRTCService.startCall(type, currentUser.id, currentUser.name)

      setActiveCall({ type, chatId: selectedChat.id })

      toast({
        title: `${type === "audio" ? "Audio" : "Video"} call started`,
        description: "Waiting for the other person to join...",
      })
    } catch (error) {
      console.error("Error starting call:", error)
      toast({
        title: "Error starting call",
        description: "Could not access camera or microphone",
        variant: "destructive",
      })
    }
  }

  const handleEndCall = () => {
    if (activeCall) {
      webRTCService.endCall()
      setActiveCall(null)

      toast({
        title: "Call ended",
        description: "The call has been ended",
      })
    }
  }

  // Filter available users based on current user's role
  const getAvailableUsers = () => {
    if (currentUser.role === "admin") {
      // Admins can chat with anyone
      return mockUsers.filter((user) => user.id !== currentUser.id)
    } else if (currentUser.role === "staff") {
      // Staff can only chat with other staff and admins
      return mockUsers.filter((user) => user.id !== currentUser.id && (user.role === "admin" || user.role === "staff"))
    } else {
      // Clients can only chat with admins
      return mockUsers.filter((user) => user.id !== currentUser.id && user.role === "admin")
    }
  }

  // Add a function to handle adding a person to a chat
  const handleAddPersonToChat = async (chatId: string, userId: string) => {
    try {
      // Find the chat to update
      const chatToUpdate = chats.find((chat) => chat.id === chatId)
      if (!chatToUpdate) return

      // Find the user to add
      const userToAdd = mockUsers.find((user) => user.id === userId)
      if (!userToAdd) return

      // In a real app, we would update the chat in Supabase
      // const { data, error } = await supabase
      //   .from('chats')
      //   .update({
      //     participants: [...chatToUpdate.participants.map(p => p.id), userId],
      //     is_group: true,
      //     name: chatToUpdate.isGroup
      //       ? chatToUpdate.name
      //       : `${chatToUpdate.participants.find((p) => p.id !== currentUser.id)?.name.split(" ")[0]} & ${currentUser.name.split(" ")[0]} Group`,
      //   })
      //   .eq('id', chatId)

      // Create a new chat with the added participant
      const updatedChat: Chat = {
        ...chatToUpdate,
        participants: [...chatToUpdate.participants, userToAdd],
        // If it wasn't a group chat before, make it one now
        isGroup: true,
        // If it wasn't a group chat before, give it a name
        name: chatToUpdate.isGroup
          ? chatToUpdate.name
          : `${chatToUpdate.participants.find((p) => p.id !== currentUser.id)?.name.split(" ")[0]} & ${currentUser.name.split(" ")[0]} Group`,
      }

      // Update the chats list
      setChats((prev) => prev.map((chat) => (chat.id === chatId ? updatedChat : chat)))

      // Close the modal
      setShowAddPersonModal(false)

      // Add a system message about the new participant
      const systemMessage: ChatMessage = {
        id: `msg_system_${Date.now()}`,
        senderId: "system",
        content: `${userToAdd.name} has been added to the chat.`,
        timestamp: new Date(),
        read: true,
      }

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), systemMessage],
      }))

      toast({
        title: "Person added to chat",
        description: `${userToAdd.name} has been added to the conversation`,
      })
    } catch (error) {
      console.error("Error adding person to chat:", error)
      toast({
        title: "Error adding person to chat",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {(!isMobile || !selectedChat) && (
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={(chat) => {
            setSelectedChat(chat)
            // Mark messages as read when selecting a chat
            setChats((prev) => prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c)))
          }}
          onCreateGroup={() => setShowCreateGroupModal(true)}
          onCreateIndividual={() => setShowCreateIndividualModal(true)}
          currentUserId={user?.id || "user1"}
          currentUserRole={(user?.role as "admin" | "staff" | "client") || "admin"}
          isLoading={isLoading}
        />
      )}

      {selectedChat && (
        <ChatWindow
          chat={selectedChat}
          messages={messages[selectedChat.id] || []}
          onSendMessage={(content, attachments, isVoiceNote, voiceNoteDuration) =>
            handleSendMessage(selectedChat.id, content, attachments, isVoiceNote, voiceNoteDuration)
          }
          onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
          showInfoPanel={showInfoPanel}
          onBack={() => setSelectedChat(null)}
          currentUserId={user?.id || "user1"}
          onStartCall={(type) => handleStartCall(type)}
          activeCall={activeCall?.chatId === selectedChat.id ? activeCall.type : undefined}
          onEndCall={handleEndCall}
          onAddPersonToChat={() => setShowAddPersonModal(true)}
        />
      )}

      {selectedChat && showInfoPanel && !isMobile && (
        <ChatInfoPanel chat={selectedChat} onClose={() => setShowInfoPanel(false)} />
      )}

      {showCreateGroupModal && (
        <CreateGroupChatModal
          users={getAvailableUsers()}
          onClose={() => setShowCreateGroupModal(false)}
          onCreateGroup={handleCreateGroupChat}
        />
      )}

      {showCreateIndividualModal && (
        <CreateIndividualChatModal
          users={getAvailableUsers()}
          onClose={() => setShowCreateIndividualModal(false)}
          onCreateChat={handleCreateIndividualChat}
        />
      )}
      {showAddPersonModal && selectedChat && (
        <AddPersonToChatModal
          chat={selectedChat}
          users={getAvailableUsers()}
          onClose={() => setShowAddPersonModal(false)}
          onAddPerson={handleAddPersonToChat}
          currentUserRole={(user?.role as "admin" | "staff" | "client") || "admin"}
        />
      )}
    </div>
  )
}
