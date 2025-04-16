"use client"

import type React from "react"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, MapPin, Users, Wrench, X, Search, CalendarRange } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function ScheduleFilters() {
  const [jobSite, setJobSite] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [staff, setStaff] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()

  // Clear all filters
  const clearFilters = () => {
    setJobSite("")
    setRole("")
    setStaff("")
    setSearchQuery("")
    setDate(undefined)

    toast({
      title: "Filters Cleared",
      description: "All schedule filters have been reset",
    })
  }

  // Handle job site filter change
  const handleJobSiteChange = (value: string) => {
    setJobSite(value)

    toast({
      title: "Job Site Filter Applied",
      description: `Filtered by ${value.replace("site-", "Site ")}`,
    })
  }

  // Handle role filter change
  const handleRoleChange = (value: string) => {
    setRole(value)

    toast({
      title: "Role Filter Applied",
      description: `Filtered by ${value.charAt(0).toUpperCase() + value.slice(1)}`,
    })
  }

  // Handle staff filter change
  const handleStaffChange = (value: string) => {
    setStaff(value)

    const staffName =
      {
        john: "John Doe",
        sarah: "Sarah Smith",
        mike: "Mike Johnson",
        lisa: "Lisa Brown",
        david: "David Wilson",
        emma: "Emma Davis",
      }[value] || value

    toast({
      title: "Staff Filter Applied",
      description: `Filtered by ${staffName}`,
    })
  }

  // Handle search query change
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      toast({
        title: "Search Applied",
        description: `Searching for "${searchQuery}"`,
      })
    }
  }

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)

    if (date) {
      toast({
        title: "Date Filter Applied",
        description: `Filtered by ${format(date, "MMMM d, yyyy")}`,
      })
    } else {
      toast({
        title: "Date Filter Removed",
        description: "Date filter has been removed",
      })
    }
  }

  // Remove individual filters
  const removeJobSiteFilter = () => {
    setJobSite("")

    toast({
      title: "Job Site Filter Removed",
      description: "Job site filter has been removed",
    })
  }

  const removeRoleFilter = () => {
    setRole("")

    toast({
      title: "Role Filter Removed",
      description: "Role filter has been removed",
    })
  }

  const removeStaffFilter = () => {
    setStaff("")

    toast({
      title: "Staff Filter Removed",
      description: "Staff filter has been removed",
    })
  }

  const removeSearchFilter = () => {
    setSearchQuery("")

    toast({
      title: "Search Filter Removed",
      description: "Search filter has been removed",
    })
  }

  const removeDateFilter = () => {
    setDate(undefined)

    toast({
      title: "Date Filter Removed",
      description: "Date filter has been removed",
    })
  }

  const hasFilters = jobSite || role || staff || searchQuery || date

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-2xl pl-8 w-[140px] border-dashed"
              />
            </div>
          </form>

          {/* Job Site Filter */}
          <Select value={jobSite} onValueChange={handleJobSiteChange}>
            <SelectTrigger className="h-9 rounded-2xl w-[140px] border-dashed">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Job Site" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="site-a">Site A</SelectItem>
              <SelectItem value="site-b">Site B</SelectItem>
              <SelectItem value="site-c">Site C</SelectItem>
              <SelectItem value="site-d">Site D</SelectItem>
            </SelectContent>
          </Select>

          {/* Role Filter */}
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="h-9 rounded-2xl w-[140px] border-dashed">
              <div className="flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Role" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="electrician">Electrician</SelectItem>
              <SelectItem value="plumber">Plumber</SelectItem>
              <SelectItem value="carpenter">Carpenter</SelectItem>
              <SelectItem value="painter">Painter</SelectItem>
              <SelectItem value="laborer">Laborer</SelectItem>
            </SelectContent>
          </Select>

          {/* Staff Filter */}
          <Select value={staff} onValueChange={handleStaffChange}>
            <SelectTrigger className="h-9 rounded-2xl w-[140px] border-dashed">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Staff" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="sarah">Sarah Smith</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
              <SelectItem value="lisa">Lisa Brown</SelectItem>
              <SelectItem value="david">David Wilson</SelectItem>
              <SelectItem value="emma">Emma Davis</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 rounded-2xl border-dashed">
                <CalendarRange className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                {date ? format(date, "MMM d, yyyy") : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>

          {/* Clear Filters Button */}
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-9 rounded-2xl" onClick={clearFilters}>
              <X className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20"
            >
              Search: {searchQuery}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={removeSearchFilter} />
            </Badge>
          )}
          {jobSite && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
            >
              Site: {jobSite.replace("site-", "Site ")}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={removeJobSiteFilter} />
            </Badge>
          )}
          {role && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-teal-500/10 text-teal-500 hover:bg-teal-500/20 border-teal-500/20"
            >
              Role: {role.charAt(0).toUpperCase() + role.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={removeRoleFilter} />
            </Badge>
          )}
          {staff && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
            >
              Staff: {staff.charAt(0).toUpperCase() + staff.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={removeStaffFilter} />
            </Badge>
          )}
          {date && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
            >
              Date: {format(date, "MMM d, yyyy")}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={removeDateFilter} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
