"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileDown } from "lucide-react"
import AddEditInventoryModal from "./add-edit-inventory-modal"

export default function InventoryHeader() {
  const [showAddModal, setShowAddModal] = useState(false)

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Exporting inventory data...")
    // In a real implementation, this would generate and download a CSV file
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your tools, equipment, and supplies across job sites</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowAddModal(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Inventory Item
          </Button>
        </div>
      </div>
      <AddEditInventoryModal open={showAddModal} onOpenChange={setShowAddModal} mode="add" />
    </div>
  )
}
