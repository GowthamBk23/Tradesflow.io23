"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, UserCircle, CheckCircle, Briefcase, Search, X } from "lucide-react"

// Mock data for clients
const clients = [
  { id: "client-1", name: "Oakwood Properties" },
  { id: "client-2", name: "Metro Commercial Ltd" },
  { id: "client-3", name: "Greenfield Developments" },
  { id: "client-4", name: "City Hospital Trust" },
  { id: "client-8", name: "Thompson Residence" },
  { id: "client-9", name: "Wilson Family Home" },
]

// Mock data for projects/sites
const projects = [
  { id: "site-a", name: "Site A - London Office" },
  { id: "site-b", name: "Site B - Manchester Residence" },
  { id: "site-c", name: "Site C - Birmingham Commercial" },
  { id: "site-d", name: "Site D - Edinburgh Hospital" },
]

export function ContractsFilters() {
  const [clientFilter, setClientFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [projectFilter, setProjectFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const clearFilters = () => {
    setClientFilter("")
    setStatusFilter("")
    setProjectFilter("")
    setSearchQuery("")
  }

  const hasFilters = clientFilter || statusFilter || projectFilter || searchQuery

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl w-full md:w-[250px]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {/* Client Filter */}
        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
            <div className="flex items-center gap-2">
              <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Client" />
            </div>
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

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="signed">Signed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Project/Site Filter */}
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
            <div className="flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Project/Site" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name.split(" - ")[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-9 rounded-2xl" onClick={clearFilters}>
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {clientFilter && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
            >
              Client:{" "}
              {clientFilter === "all" ? "All" : clients.find((c) => c.id === clientFilter)?.name || clientFilter}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setClientFilter("")} />
            </Badge>
          )}
          {statusFilter && (
            <Badge
              variant="outline"
              className={`rounded-2xl ${
                statusFilter === "signed"
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  : statusFilter === "rejected"
                    ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"
                    : statusFilter === "pending"
                      ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                      : "bg-muted/50 text-muted-foreground"
              }`}
            >
              Status: {statusFilter === "all" ? "All" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStatusFilter("")} />
            </Badge>
          )}
          {projectFilter && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 border-teal-500/20"
            >
              Project:{" "}
              {projectFilter === "all"
                ? "All"
                : projects.find((p) => p.id === projectFilter)?.name.split(" - ")[0] || projectFilter}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setProjectFilter("")} />
            </Badge>
          )}
          {searchQuery && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
            >
              Search: {searchQuery}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSearchQuery("")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
