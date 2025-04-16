"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { XCircle, Loader2 } from "lucide-react"

interface DenyDialogProps {
  isOpen: boolean
  onClose: () => void
  requestId: string
  onDeny?: (id: string) => void
}

export default function DenyDialog({ isOpen, onClose, requestId, onDeny }: DenyDialogProps) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeny = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      if (onDeny) {
        onDeny(requestId)
      }
      onClose()
    }, 1000)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deny Material Request</AlertDialogTitle>
          <AlertDialogDescription>
            Please provide a reason for denying request <span className="font-medium">{requestId}</span>. This will be
            shared with the requesting staff member.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason for denial</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for denying this request..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <Button onClick={handleDeny} disabled={isSubmitting || !reason.trim()} variant="destructive">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Denying...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Deny Request
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
