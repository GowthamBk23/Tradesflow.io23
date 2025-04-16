"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SignatureCanvasComponent } from "./signature-canvas"

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSign: (signatureData: string, signatureType: "drawn" | "typed") => void
  contractTitle: string
}

export function SignatureModal({ isOpen, onClose, onSign, contractTitle }: SignatureModalProps) {
  const [signatureType, setSignatureType] = useState<"drawn" | "typed">("drawn")

  const handleSave = (signatureData: string, type: "drawn" | "typed") => {
    onSign(signatureData, type)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Sign Contract: {contractTitle}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-6">
            By signing this document, you acknowledge that you have read, understood, and agree to the terms and
            conditions outlined in the contract.
          </p>
          <SignatureCanvasComponent onSave={handleSave} signatureType={signatureType} onTypeChange={setSignatureType} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
