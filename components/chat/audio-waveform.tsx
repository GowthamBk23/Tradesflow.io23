"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause, Mic } from "lucide-react"

interface AudioWaveformProps {
  duration?: number
  isRecording?: boolean
  isPlaying?: boolean
  onPlayPause?: () => void
  className?: string
  audioData?: number[] // For playback visualization - REMOVED in update
}

export function AudioWaveform({
  duration = 0,
  isRecording = false,
  isPlaying = false,
  onPlayPause,
  className = "",
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)

  // Generate random waveform data
  const generateWaveformData = (length: number) => {
    const data = []
    for (let i = 0; i < length; i++) {
      // Create a more natural looking waveform with some patterns
      const value = 0.1 + Math.random() * 0.8
      data.push(value)
    }
    return data
  }

  // Waveform data - generate once and reuse
  const waveformData = useRef(generateWaveformData(50))

  // Draw the waveform on the canvas
  const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number, progressPercent: number) => {
    ctx.clearRect(0, 0, width, height)

    const barWidth = Math.max(2, width / waveformData.current.length - 2)
    const barMargin = 2
    const centerY = height / 2

    // Draw each bar of the waveform
    waveformData.current.forEach((value, index) => {
      const x = index * (barWidth + barMargin)
      const barHeight = value * (height * 0.8)

      // For recording, animate the bars
      let adjustedHeight = barHeight
      if (isRecording) {
        // Add a pulsing effect during recording
        const time = Date.now() / 1000
        const pulse = Math.sin(time * 5 + index * 0.5) * 0.2 + 0.8
        adjustedHeight = barHeight * pulse
      }

      // Determine if this bar is before or after the progress point
      const isActive = index / waveformData.current.length < progressPercent

      // Set color based on state
      if (isRecording) {
        ctx.fillStyle = "#ef4444" // Red for recording
      } else {
        ctx.fillStyle = isActive ? "#3b82f6" : "#64748b" // Blue for played, gray for unplayed
      }

      // Draw the bar
      ctx.beginPath()
      ctx.roundRect(x, centerY - adjustedHeight / 2, barWidth, adjustedHeight, [barWidth / 2])
      ctx.fill()
    })

    // Add recording indicator
    if (isRecording) {
      const pulseSize = 6 + Math.sin(Date.now() / 200) * 2
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(width - 10, 10, pulseSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Animation loop for playback progress
  useEffect(() => {
    if (!canvasRef.current || !duration) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateProgress = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const newProgress = isPlaying ? Math.min(elapsed / (duration * 1000), 1) : progress
      setProgress(newProgress)

      drawWaveform(ctx, canvas.width, canvas.height, newProgress)

      if (isPlaying && newProgress < 1) {
        animationRef.current = requestAnimationFrame(updateProgress)
      } else if (isPlaying && newProgress >= 1) {
        // Reset when playback completes
        setProgress(0)
        startTimeRef.current = 0
        if (onPlayPause) onPlayPause()
      }
    }

    // Start or continue animation
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress)
    } else {
      // Just draw the current state without animation
      drawWaveform(ctx, canvas.width, canvas.height, progress)
    }

    // Clean up animation on unmount or when props change
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, isRecording, duration, progress, onPlayPause])

  // Reset progress when switching between voice messages
  useEffect(() => {
    setProgress(0)
    startTimeRef.current = 0

    // Generate new random waveform data when the component props change
    waveformData.current = generateWaveformData(50)

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [duration])

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions to match its display size
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Redraw at the current progress
      drawWaveform(ctx, canvas.width, canvas.height, progress)
    }

    // Initial setup
    handleResize()

    // Listen for window resize events
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [progress])

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Play/Pause button or Mic icon */}
      {!isRecording ? (
        <button
          onClick={onPlayPause}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      ) : (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white mr-2">
          <Mic size={16} />
        </div>
      )}

      {/* Waveform canvas */}
      <div className="flex-grow h-12 relative">
        <canvas ref={canvasRef} className="w-full h-full cursor-pointer" onClick={onPlayPause} />

        {/* Duration text */}
        {duration > 0 && !isRecording && (
          <div className="absolute right-2 bottom-0 text-xs text-muted-foreground">
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, "0")}
          </div>
        )}

        {/* Recording time */}
        {isRecording && <div className="absolute right-2 bottom-0 text-xs text-red-500 font-medium">Recording...</div>}
      </div>
    </div>
  )
}
