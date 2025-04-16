"use client"

import { useState } from "react"
import { Search, CalendarRange, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface PayrollFiltersProps {
  onFilterChange: (filters: any) => void
}

export function PayrollFilters({ onFilterChange }: PayrollFiltersProps) {
  const [filters, setFilters] = useState({
    dateRange: "this-week",
    staffMember: "",
    jobSite: "",
    role: "",
    status: "",
    unpaidOnly: false,
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  })

  // Predefined date ranges
  const dateRanges = [
    { value: "today", label: "Today" },
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "last-month", label: "Last Month" },
    { value: "custom", label: "Custom Range" },
  ]

  // Mock data for dropdowns
  const jobSites = [
    { value: "Downtown Project", label: "Downtown Project" },
    { value: "Riverside Building", label: "Riverside Building" },
    { value: "Hillside Residence", label: "Hillside Residence" },
  ]

  const roles = [
    { value: "Electrician", label: "Electrician" },
    { value: "Plumber", label: "Plumber" },
    { value: "Carpenter", label: "Carpenter" },
    { value: "Painter", label: "Painter" },
    { value: "HVAC Technician", label: "HVAC Technician" },
  ]

  const statuses = [
    { value: "Pending", label: "Pending" },
    { value: "Paid", label: "Paid" },
  ]

  // Remove this useEffect entirely:
  // useEffect(() => {
  //   onFilterChange(filters)
  // }, [filters, onFilterChange])

  // Instead, modify the handleFilterChange function to call onFilterChange after updating the state:
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters }
    newFilters[key] = value

    // If unpaidOnly is toggled on, set status to Pending
    if (key === "unpaidOnly" && value === true) {
      newFilters.status = "Pending"
    }

    // If status is changed and not Pending, turn off unpaidOnly
    if (key === "status" && value !== "Pending") {
      newFilters.unpaidOnly = false
    }

    setFilters(newFilters)
    // Call onFilterChange with the new filters
    onFilterChange(newFilters)
  }

  // Also update the clearFilters function to call onFilterChange:
  const clearFilters = () => {
    const defaultFilters = {
      dateRange: "this-week",
      staffMember: "",
      jobSite: "",
      role: "",
      status: "",
      unpaidOnly: false,
      startDate: undefined,
      endDate: undefined,
    }

    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  // Check if any filters are active
  const hasActiveFilters =
    filters.staffMember !== "" ||
    filters.jobSite !== "" ||
    filters.role !== "" ||
    filters.status !== "" ||
    filters.unpaidOnly ||
    filters.dateRange !== "this-week"

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Date Range Selector */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="date-range">Date Range</Label>
          <div className="flex gap-2">
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
              <SelectTrigger id="date-range" className="flex-1">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filters.dateRange === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <CalendarRange className="mr-2 h-4 w-4" />
                    {filters.startDate && filters.endDate
                      ? `${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`
                      : "Select dates"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filters.startDate,
                      to: filters.endDate,
                    }}
                    onSelect={(range) => {
                      handleFilterChange("startDate", range?.from)
                      handleFilterChange("endDate", range?.to)
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Staff Search */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="staff-search">Staff Member</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="staff-search"
              placeholder="Search by name"
              className="pl-8"
              value={filters.staffMember}
              onChange={(e) => handleFilterChange("staffMember", e.target.value)}
            />
          </div>
        </div>

        {/* Job Site Filter */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="job-site">Job Site</Label>
          <Select value={filters.jobSite} onValueChange={(value) => handleFilterChange("jobSite", value)}>
            <SelectTrigger id="job-site">
              <SelectValue placeholder="All sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sites</SelectItem>
              {jobSites.map((site) => (
                <SelectItem key={site.value} value={site.value}>
                  {site.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={filters.role} onValueChange={(value) => handleFilterChange("role", value)}>
            <SelectTrigger id="role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter and Unpaid Only Toggle */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-0.5">
            <Label htmlFor="status">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger id="status" className="w-[130px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="unpaid-only"
              checked={filters.unpaidOnly}
              onCheckedChange={(checked) => handleFilterChange("unpaidOnly", checked)}
            />
            <Label htmlFor="unpaid-only">Unpaid Only</Label>
          </div>
        </div>

        {/* Active Filters and Clear Button */}
        <div className="flex flex-wrap items-center gap-2">
          {hasActiveFilters && (
            <>
              {filters.staffMember && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Staff: {filters.staffMember}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("staffMember", "")} />
                </Badge>
              )}

              {filters.jobSite && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Site: {filters.jobSite}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("jobSite", "")} />
                </Badge>
              )}

              {filters.role && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Role: {filters.role}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("role", "")} />
                </Badge>
              )}

              {filters.status && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("status", "")} />
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2 text-xs">
                Clear all
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
