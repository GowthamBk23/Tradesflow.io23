"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, FileText } from "lucide-react"
import { useState } from "react"
import { CreateContractModal } from "./create-contract-modal"
import Link from "next/link"

interface ContractsHeaderProps {
  isClientView?: boolean
}

export function ContractsHeader({ isClientView = false }: ContractsHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
        <p className="text-muted-foreground">
          {isClientView ? "View and sign contracts for your projects" : "Manage your contracts and agreements"}
        </p>
      </div>
      {!isClientView && (
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)} className="rounded-2xl">
            <PlusCircle className="mr-2 h-4 w-4" />
            Quick Create
          </Button>
          <Button asChild className="rounded-2xl">
            <Link href="/dashboard/contracts/create">
              <FileText className="mr-2 h-4 w-4" />
              Contract Generator
            </Link>
          </Button>
        </div>
      )}

      <CreateContractModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
