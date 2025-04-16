"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Download, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { AddEditClientModal } from "./add-edit-client-modal"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ClientsHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Search initiated",
      description: `Searching for: "${searchQuery}"`,
    })
    // In a real app, this would trigger a search
  }

  const handleSaveClient = (clientData: any) => {
    // In a real app, this would save the client to the database
    console.log("Client data saved:", clientData)
    // The toast is already handled in the modal component
  }

  const handleExport = () => {
    toast({
      title: "Exporting clients",
      description: "Your client data is being exported to CSV",
    })
    // In a real app, this would trigger a CSV export
  }

  const handleImport = () => {
    toast({
      title: "Import clients",
      description: "Please select a CSV file to import client data",
    })
    // In a real app, this would open a file picker
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Manage your clients and their projects</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clients..."
            className="pl-9 rounded-2xl w-full sm:w-[200px] md:w-[260px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Export/Import Buttons */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-2xl" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Export Clients</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Clients to CSV</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-2xl" onClick={handleImport}>
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Import Clients</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import Clients from CSV</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Add Client Button */}
        <Button className="rounded-2xl w-full sm:w-auto" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Add Client Modal */}
      <AddEditClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        client={null}
        onSave={handleSaveClient}
      />
    </div>
  )
}
