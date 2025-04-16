import { supabase } from "./supabase"

type PeerConnection = RTCPeerConnection
type MediaStream = MediaStream
type RTCSessionDescription = RTCSessionDescription
type RTCIceCandidate = RTCIceCandidate

export type CallType = "audio" | "video"

interface CallOffer {
  type: "offer"
  sdp: RTCSessionDescriptionInit
  callerId: string
  callerName: string
  callType: CallType
}

interface CallAnswer {
  type: "answer"
  sdp: RTCSessionDescriptionInit
  answererId: string
}

interface IceCandidate {
  type: "ice-candidate"
  candidate: RTCIceCandidateInit
  senderId: string
}

interface CallEvent {
  type: "call-ended" | "call-rejected"
  userId: string
}

type CallEventHandler = (event: CallOffer | CallAnswer | IceCandidate | CallEvent) => void

export class WebRTCService {
  private peerConnection: PeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private channel: any | null = null
  private eventHandlers: CallEventHandler[] = []
  private iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
  }

  constructor() {
    this.setupPeerConnection = this.setupPeerConnection.bind(this)
    this.handleIncomingOffer = this.handleIncomingOffer.bind(this)
    this.handleIncomingAnswer = this.handleIncomingAnswer.bind(this)
    this.handleIncomingIceCandidate = this.handleIncomingIceCandidate.bind(this)
    this.handleCallEnded = this.handleCallEnded.bind(this)
  }

  public async joinChannel(chatId: string, userId: string) {
    // Leave any existing channel
    if (this.channel) {
      await supabase.removeChannel(this.channel)
    }

    // Join the new channel
    this.channel = supabase
      .channel(`call-${chatId}`)
      .on("broadcast", { event: "call-offer" }, (payload) => {
        if (payload.payload.callerId !== userId) {
          this.handleIncomingOffer(payload.payload as CallOffer)
        }
      })
      .on("broadcast", { event: "call-answer" }, (payload) => {
        if (payload.payload.answererId !== userId) {
          this.handleIncomingAnswer(payload.payload as CallAnswer)
        }
      })
      .on("broadcast", { event: "ice-candidate" }, (payload) => {
        if (payload.payload.senderId !== userId) {
          this.handleIncomingIceCandidate(payload.payload as IceCandidate)
        }
      })
      .on("broadcast", { event: "call-ended" }, (payload) => {
        if (payload.payload.userId !== userId) {
          this.handleCallEnded()
        }
      })
      .on("broadcast", { event: "call-rejected" }, (payload) => {
        if (payload.payload.userId !== userId) {
          this.notifyEventHandlers({
            type: "call-rejected",
            userId: payload.payload.userId,
          })
        }
      })
      .subscribe()

    return this.channel
  }

  public async leaveChannel() {
    if (this.channel) {
      await supabase.removeChannel(this.channel)
      this.channel = null
    }
  }

  public async startCall(callType: CallType, userId: string, userName: string) {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      })

      // Setup peer connection
      await this.setupPeerConnection()

      // Create and send offer
      const offer = await this.peerConnection!.createOffer()
      await this.peerConnection!.setLocalDescription(offer)

      // Send the offer via the channel
      this.channel?.send({
        type: "broadcast",
        event: "call-offer",
        payload: {
          type: "offer",
          sdp: offer,
          callerId: userId,
          callerName: userName,
          callType,
        } as CallOffer,
      })

      return this.localStream
    } catch (error) {
      console.error("Error starting call:", error)
      this.endCall()
      throw error
    }
  }

  public async answerCall(userId: string) {
    try {
      if (!this.peerConnection) {
        throw new Error("No peer connection established")
      }

      // Create and send answer
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)

      // Send the answer via the channel
      this.channel?.send({
        type: "broadcast",
        event: "call-answer",
        payload: {
          type: "answer",
          sdp: answer,
          answererId: userId,
        } as CallAnswer,
      })

      return this.localStream
    } catch (error) {
      console.error("Error answering call:", error)
      this.endCall()
      throw error
    }
  }

  public rejectCall(userId: string) {
    this.channel?.send({
      type: "broadcast",
      event: "call-rejected",
      payload: {
        type: "call-rejected",
        userId,
      } as CallEvent,
    })

    this.endCall()
  }

  public endCall() {
    // Send call ended event
    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "call-ended",
        payload: {
          type: "call-ended",
          userId: "current-user", // This should be the actual user ID in production
        } as CallEvent,
      })
    }

    // Stop all tracks in the local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    // Close the peer connection
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    // Clear remote stream
    this.remoteStream = null
  }

  public getLocalStream() {
    return this.localStream
  }

  public getRemoteStream() {
    return this.remoteStream
  }

  public async toggleAudio(enabled: boolean) {
    if (this.localStream) {
      const audioTracks = this.localStream.getAudioTracks()
      audioTracks.forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  public async toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTracks = this.localStream.getVideoTracks()
      videoTracks.forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  public async shareScreen(enabled: boolean) {
    if (!this.peerConnection) return

    if (enabled) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })

        // Replace video track with screen sharing track
        if (this.localStream) {
          const videoTrack = screenStream.getVideoTracks()[0]
          const sender = this.peerConnection.getSenders().find((s) => s.track?.kind === "video")

          if (sender) {
            sender.replaceTrack(videoTrack)
          } else {
            screenStream.getTracks().forEach((track) => this.peerConnection!.addTrack(track, screenStream))
          }

          // When screen sharing stops
          videoTrack.onended = () => {
            this.shareScreen(false)
          }

          return screenStream
        }
      } catch (error) {
        console.error("Error sharing screen:", error)
      }
    } else {
      // Revert to camera
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
        const videoTrack = videoStream.getVideoTracks()[0]

        const sender = this.peerConnection.getSenders().find((s) => s.track?.kind === "video")

        if (sender) {
          sender.replaceTrack(videoTrack)
        }

        return this.localStream
      } catch (error) {
        console.error("Error reverting to camera:", error)
      }
    }
  }

  public addEventListener(handler: CallEventHandler) {
    this.eventHandlers.push(handler)
  }

  public removeEventListener(handler: CallEventHandler) {
    this.eventHandlers = this.eventHandlers.filter((h) => h !== handler)
  }

  private async setupPeerConnection() {
    // Create a new peer connection
    this.peerConnection = new RTCPeerConnection(this.iceServers)

    // Add local stream tracks to the peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection!.addTrack(track, this.localStream!)
      })
    }

    // Create remote stream
    this.remoteStream = new MediaStream()

    // Handle incoming tracks
    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream!.addTrack(track)
      })

      // Notify event handlers about the remote stream
      this.notifyEventHandlers({
        type: "remote-stream-updated",
        stream: this.remoteStream,
      } as any)
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.channel?.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: {
            type: "ice-candidate",
            candidate: event.candidate,
            senderId: "current-user", // This should be the actual user ID in production
          } as IceCandidate,
        })
      }
    }

    return this.peerConnection
  }

  private async handleIncomingOffer(offer: CallOffer) {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: offer.callType === "video",
      })

      // Setup peer connection
      await this.setupPeerConnection()

      // Set remote description
      await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer.sdp))

      // Notify event handlers about the incoming call
      this.notifyEventHandlers(offer)
    } catch (error) {
      console.error("Error handling incoming offer:", error)
      this.endCall()
    }
  }

  private async handleIncomingAnswer(answer: CallAnswer) {
    try {
      if (!this.peerConnection) {
        throw new Error("No peer connection established")
      }

      // Set remote description
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer.sdp))
    } catch (error) {
      console.error("Error handling incoming answer:", error)
      this.endCall()
    }
  }

  private async handleIncomingIceCandidate(iceCandidate: IceCandidate) {
    try {
      if (!this.peerConnection) {
        throw new Error("No peer connection established")
      }

      // Add ICE candidate
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate.candidate))
    } catch (error) {
      console.error("Error handling incoming ICE candidate:", error)
    }
  }

  private handleCallEnded() {
    this.endCall()
    this.notifyEventHandlers({
      type: "call-ended",
      userId: "remote-user", // This should be the actual user ID in production
    })
  }

  private notifyEventHandlers(event: any) {
    this.eventHandlers.forEach((handler) => handler(event))
  }
}

export const webRTCService = new WebRTCService()
