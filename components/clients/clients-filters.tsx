"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Building, Activity, Briefcase, X, Users, Tag, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ClientsFilters() {
  const [industry, setIndustry] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [projectCount, setProjectCount] = useState<string>("")
  const [clientType, setClientType] = useState<string>("")
  const [tag, setTag] = useState<string>("")
  const [lastContact, setLastContact] = useState<string>("")
  const { toast } = useToast()

  const clearFilters = () => {
    setIndustry("")
    setStatus("")
    setProjectCount("")
    setClientType("")
    setTag("")
    setLastContact("")

    toast({
      title: "Filters cleared",
      description: "All filters have been reset",
    })
  }

  const hasFilters = industry || status || projectCount || clientType || tag || lastContact

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "industry":
        setIndustry(value)
        break
      case "status":
        setStatus(value)
        break
      case "projectCount":
        setProjectCount(value)
        break
      case "clientType":
        setClientType(value)
        break
      case "tag":
        setTag(value)
        break
      case "lastContact":
        setLastContact(value)
        break
    }

    toast({
      title: "Filter applied",
      description: `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} filter set to: ${value}`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Industry Filter */}
          <Select value={industry} onValueChange={(value) => handleFilterChange("industry", value)}>
            <SelectTrigger className="h-9 rounded-2xl w-[140px] border-dashed">
              <div className="flex items-center gap-2">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Industry" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="h-9 rounded-2xl w-[140px] border-dashed">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>

          {/* Project Count Filter */}
          <Select value={projectCount} onValueChange={(value) => handleFilterChange("projectCount", value)}>
            <SelectTrigger className="h-9 rounded-2xl w-[180px] border-dashed">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Number of Projects" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No Projects</SelectItem>
              <SelectItem value="1-3">1-3 Projects</SelectItem>
              <SelectItem value="4-10">4-10 Projects</SelectItem>
              <SelectItem value="10+">10+ Projects</SelectItem>
            </SelectContent>
          </Select>

          {/* Client Type Filter */}
          <Select value={clientType} onValueChange={(value) => handleFilterChange("clientType", value)}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Client Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Select value={tag} onValueChange={(value) => handleFilterChange("tag", value)}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Tag" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vip">VIP Client</SelectItem>
              <SelectItem value="follow-up">Needs Follow-Up</SelectItem>
              <SelectItem value="late-payer">Late Payer</SelectItem>
              <SelectItem value="new">New Client</SelectItem>
              <SelectItem value="potential">Potential Growth</SelectItem>
            </SelectContent>
          </Select>

          {/* Last Contact Filter */}
          <Select value={lastContact} onValueChange={(value) => handleFilterChange("lastContact", value)}>
            <SelectTrigger className="h-9 rounded-2xl w-[180px] border-dashed">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Last Contacted" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="3-months">Last 3 Months</SelectItem>
              <SelectItem value="6-months">Last 6 Months</SelectItem>
              <SelectItem value="not-contacted">Not Contacted</SelectItem>
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
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {industry && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
            >
              Industry: {industry.charAt(0).toUpperCase() + industry.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setIndustry("")} />
            </Badge>
          )}
          {status && (
            <Badge
              variant="outline"
              className={`rounded-2xl ${
                status === "active"
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  : status === "vip"
                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"
              }`}
            >
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStatus("")} />
            </Badge>
          )}
          {projectCount && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
            >
              Projects: {projectCount}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setProjectCount("")} />
            </Badge>
          )}
          {clientType && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 border-teal-500/20"
            >
              Type: {clientType === "company" ? "Company" : "Individual"}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setClientType("")} />
            </Badge>
          )}
          {tag && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 border-indigo-500/20"
            >
              Tag:{" "}
              {tag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setTag("")} />
            </Badge>
          )}
          {lastContact && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"
            >
              Last Contact:{" "}
              {lastContact
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setLastContact("")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
