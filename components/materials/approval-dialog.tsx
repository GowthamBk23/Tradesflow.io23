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
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApprovalDialogProps {
  isOpen: boolean
  onClose: () => void
  requestId: string
  onApprove?: (id: string) => void
}

export default function ApprovalDialog({ isOpen, onClose, requestId, onApprove }: ApprovalDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleApprove = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      if (onApprove) {
        onApprove(requestId)
      }
      onClose()
    }, 1000)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Material Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve request <span className="font-medium">{requestId}</span>? This will notify
            the requesting staff member and mark the request as approved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Request
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
