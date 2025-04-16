"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, LayoutGrid, List, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectsFiltersProps {
  filters: {
    status: string
    client: string
    location: string
    search: string
  }
  setFilters: (filters: any) => void
  viewType: "table" | "card"
  setViewType: (type: "table" | "card") => void
}

export function ProjectsFilters({ filters, setFilters, viewType, setViewType }: ProjectsFiltersProps) {
  const { toast } = useToast()

  // Mock data for dropdowns
  const clients = [
    { id: "client1", name: "Riverside Corp" },
    { id: "client2", name: "Metro Business" },
    { id: "client3", name: "Oakwood Properties" },
    { id: "client4", name: "Sunset Homes" },
  ]

  const locations = [
    { id: "loc1", name: "London" },
    { id: "loc2", name: "Manchester" },
    { id: "loc3", name: "Birmingham" },
    { id: "loc4", name: "Glasgow" },
  ]

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })

    // Show toast notification
    if (key !== "search") {
      const filterName = key.charAt(0).toUpperCase() + key.slice(1)
      const filterValue =
        value === "all"
          ? "All"
          : key === "client"
            ? clients.find((c) => c.id === value)?.name || value
            : key === "location"
              ? locations.find((l) => l.id === value)?.name || value
              : value.charAt(0).toUpperCase() + value.slice(1)

      toast({
        title: `${filterName} Filter Applied`,
        description: `Showing projects with ${filterName.toLowerCase()}: ${filterValue}`,
      })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (filters.search) {
      toast({
        title: "Search Applied",
        description: `Showing results for "${filters.search}"`,
      })
    }
  }

  const handleClearFilters = () => {
    setFilters({
      status: "all",
      client: "all",
      location: "all",
      search: "",
    })

    toast({
      title: "Filters Cleared",
      description: "All filters have been reset.",
    })
  }

  const handleViewChange = (type: "table" | "card") => {
    setViewType(type)

    toast({
      title: "View Changed",
      description: `Switched to ${type === "table" ? "table" : "card"} view.`,
    })
  }

  const handleClearSearch = () => {
    setFilters({ ...filters, search: "" })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-4">
          <form className="relative flex-1" onSubmit={handleSearch}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            {filters.search && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </form>
          <div className="flex items-center gap-2">
            <Button
              variant={viewType === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => handleViewChange("table")}
              className="h-9 w-9"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Table view</span>
            </Button>
            <Button
              variant={viewType === "card" ? "default" : "outline"}
              size="icon"
              onClick={() => handleViewChange("card")}
              className="h-9 w-9"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Card view</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.client} onValueChange={(value) => handleFilterChange("client", value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
