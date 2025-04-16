"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { CreateInvoiceModal } from "./create-invoice-modal"

interface InvoicesHeaderProps {
  isClientView?: boolean
}

export function InvoicesHeader({ isClientView = false }: InvoicesHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          {isClientView ? "View and pay invoices for your projects" : "Manage your invoices and payments"}
        </p>
      </div>
      {!isClientView && (
        <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-2xl">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      )}

      <CreateInvoiceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
