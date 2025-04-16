"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, X, Send } from "lucide-react"
import { voiceRecorder } from "@/lib/voice-recorder"
import { AudioWaveform } from "./audio-waveform"

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void
  onCancel: () => void
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Start recording when component mounts
    startRecording()

    return () => {
      // Clean up when component unmounts
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      voiceRecorder.cancelRecording()
    }
  }, [])

  const startRecording = async () => {
    try {
      await voiceRecorder.startRecording()
      setIsRecording(true)

      // Start timer to update recording duration
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
      onCancel()
    }
  }

  const stopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    try {
      const audioBlob = await voiceRecorder.stopRecording()
      setIsRecording(false)
      onSend(audioBlob)
    } catch (error) {
      console.error("Error stopping recording:", error)
      onCancel()
    }
  }

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    voiceRecorder.cancelRecording()
    setIsRecording(false)
    onCancel()
  }

  // Format recording duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-muted rounded-lg p-3 flex items-center gap-3">
        <span className="animate-pulse">
          <Mic className="h-5 w-5 text-red-500" />
        </span>

        <div className="flex-1">
          <AudioWaveform isRecording={true} className="w-full" />
        </div>

        <span className="text-sm font-medium shrink-0">{formatDuration(recordingDuration)}</span>
      </div>

      <Button variant="destructive" size="icon" onClick={cancelRecording}>
        <X className="h-5 w-5" />
      </Button>

      <Button variant="primary" size="icon" onClick={stopRecording}>
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}
