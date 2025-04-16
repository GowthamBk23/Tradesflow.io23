"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, Phone, MonitorUp, X } from "lucide-react"
import { webRTCService, type CallType } from "@/lib/webrtc-service"

interface CallModalProps {
  isOpen: boolean
  onClose: () => void
  callType: CallType
  isIncoming?: boolean
  callerName?: string
  onAccept?: () => void
  onReject?: () => void
}

export function CallModal({
  isOpen,
  onClose,
  callType,
  isIncoming = false,
  callerName,
  onAccept,
  onReject,
}: CallModalProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video")
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Set up local stream
    const localStream = webRTCService.getLocalStream()
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }

    // Set up remote stream
    const remoteStream = webRTCService.getRemoteStream()
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }

    // Listen for remote stream updates
    const handleRemoteStreamUpdate = (event: any) => {
      if (event.type === "remote-stream-updated" && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.stream
      }
    }

    webRTCService.addEventListener(handleRemoteStreamUpdate)

    return () => {
      webRTCService.removeEventListener(handleRemoteStreamUpdate)
    }
  }, [isOpen])

  const handleToggleAudio = () => {
    webRTCService.toggleAudio(!isAudioEnabled)
    setIsAudioEnabled(!isAudioEnabled)
  }

  const handleToggleVideo = () => {
    webRTCService.toggleVideo(!isVideoEnabled)
    setIsVideoEnabled(!isVideoEnabled)
  }

  const handleToggleScreenShare = async () => {
    try {
      await webRTCService.shareScreen(!isScreenSharing)
      setIsScreenSharing(!isScreenSharing)
    } catch (error) {
      console.error("Error toggling screen share:", error)
    }
  }

  const handleEndCall = () => {
    webRTCService.endCall()
    onClose()
  }

  const handleAcceptCall = () => {
    onAccept?.()
  }

  const handleRejectCall = () => {
    onReject?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-background">
        <div className="flex flex-col h-[600px]">
          {/* Call header */}
          <div className="p-4 border-b flex items-center justify-between bg-muted/30">
            <div>
              <h3 className="text-lg font-medium">
                {isIncoming ? "Incoming Call" : `${callType === "video" ? "Video" : "Audio"} Call`}
              </h3>
              {isIncoming && callerName && <p className="text-sm text-muted-foreground">from {callerName}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video container */}
          <div className="flex-1 bg-black relative overflow-hidden">
            {/* Remote video (full size) */}
            {callType === "video" && (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            )}

            {/* Local video (picture-in-picture) */}
            {callType === "video" && (
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden border-2 border-background shadow-lg">
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              </div>
            )}

            {/* Audio-only call display */}
            {callType === "audio" && (
              <div className="flex items-center justify-center h-full">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <Phone className="h-12 w-12 text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Call controls */}
          {isIncoming ? (
            <div className="p-4 flex items-center justify-center gap-4 bg-muted/10">
              <Button variant="destructive" className="rounded-full h-12 w-12 p-0" onClick={handleRejectCall}>
                <Phone className="h-6 w-6 rotate-135" />
              </Button>
              <Button
                variant="default"
                className="rounded-full h-12 w-12 p-0 bg-green-600 hover:bg-green-700"
                onClick={handleAcceptCall}
              >
                <Phone className="h-6 w-6" />
              </Button>
            </div>
          ) : (
            <div className="p-4 flex items-center justify-center gap-4 bg-muted/10">
              <Button
                variant={isAudioEnabled ? "outline" : "secondary"}
                className="rounded-full h-12 w-12 p-0"
                onClick={handleToggleAudio}
              >
                {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>

              {callType === "video" && (
                <Button
                  variant={isVideoEnabled ? "outline" : "secondary"}
                  className="rounded-full h-12 w-12 p-0"
                  onClick={handleToggleVideo}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              )}

              {callType === "video" && (
                <Button
                  variant={isScreenSharing ? "secondary" : "outline"}
                  className="rounded-full h-12 w-12 p-0"
                  onClick={handleToggleScreenShare}
                >
                  <MonitorUp className="h-5 w-5" />
                </Button>
              )}

              <Button variant="destructive" className="rounded-full h-12 w-12 p-0" onClick={handleEndCall}>
                <Phone className="h-6 w-6 rotate-135" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
