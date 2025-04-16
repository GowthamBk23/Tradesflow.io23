"use client"

import { useRef, useState, useEffect } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eraser, Type } from "lucide-react"

interface SignatureCanvasProps {
  onSave: (signatureData: string, type: "drawn" | "typed") => void
  signatureType: "drawn" | "typed"
  onTypeChange: (type: "drawn" | "typed") => void
}

export function SignatureCanvasComponent({ onSave, signatureType, onTypeChange }: SignatureCanvasProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const [typedSignature, setTypedSignature] = useState("")
  const [canvasWidth, setCanvasWidth] = useState(500)
  const [canvasHeight, setCanvasHeight] = useState(200)
  const containerRef = useRef<HTMLDivElement>(null)

  // Resize canvas based on container size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 2 // Subtract border width
        setCanvasWidth(width)
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [])

  // Clear signature
  const handleClear = () => {
    if (signatureType === "drawn" && sigCanvas.current) {
      sigCanvas.current.clear()
    } else {
      setTypedSignature("")
    }
  }

  // Save signature
  const handleSave = () => {
    if (signatureType === "drawn" && sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        alert("Please provide a signature")
        return
      }
      const dataURL = sigCanvas.current.toDataURL("image/png")
      onSave(dataURL, "drawn")
    } else {
      if (!typedSignature.trim()) {
        alert("Please type your signature")
        return
      }
      // Create a canvas to render the typed signature
      const canvas = document.createElement("canvas")
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.font = "italic 36px 'Brush Script MT', cursive"
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2)

        const dataURL = canvas.toDataURL("image/png")
        onSave(dataURL, "typed")
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-4 mb-4">
        <Button
          type="button"
          variant={signatureType === "drawn" ? "default" : "outline"}
          className="rounded-xl"
          onClick={() => onTypeChange("drawn")}
        >
          <Eraser className="h-4 w-4 mr-2" />
          Draw Signature
        </Button>
        <Button
          type="button"
          variant={signatureType === "typed" ? "default" : "outline"}
          className="rounded-xl"
          onClick={() => onTypeChange("typed")}
        >
          <Type className="h-4 w-4 mr-2" />
          Type Signature
        </Button>
      </div>

      <div ref={containerRef} className="border border-border rounded-xl bg-white">
        {signatureType === "drawn" ? (
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              width: canvasWidth,
              height: canvasHeight,
              className: "signature-canvas rounded-xl",
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-[200px] p-4">
            <Input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Type your full name"
              className="max-w-md text-center text-xl font-signature"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleClear} className="rounded-xl">
          Clear
        </Button>
        <Button type="button" onClick={handleSave} className="rounded-xl">
          Save Signature
        </Button>
      </div>
    </div>
  )
}
