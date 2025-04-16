"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import RequestMaterialModal from "./request-material-modal"

interface MaterialsHeaderProps {
  isStaffView?: boolean
}

export default function MaterialsHeader({ isStaffView = false }: MaterialsHeaderProps) {
  const [showRequestModal, setShowRequestModal] = useState(false)

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Materials</h1>
        <p className="text-muted-foreground">
          {isStaffView ? "View materials ordered for your sites" : "Manage material requests and inventory"}
        </p>
      </div>
      <Button onClick={() => setShowRequestModal(true)} className="rounded-2xl">
        <Plus className="mr-2 h-4 w-4" />
        Request Materials
      </Button>
      <RequestMaterialModal open={showRequestModal} onOpenChange={setShowRequestModal} isStaffView={isStaffView} />
    </div>
  )
}
