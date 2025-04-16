import type { Metadata } from "next"
import ChatLayout from "@/components/chat/chat-layout"

export const metadata: Metadata = {
  title: "Chat | Trades Flow",
  description: "Secure messaging for your team and clients",
}

export default function ChatPage() {
  return <ChatLayout />
}
