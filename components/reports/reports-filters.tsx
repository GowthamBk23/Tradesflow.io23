"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Users, Briefcase, BarChart, X } from "lucide-react"

// Mock data for staff
const staffMembers = [
  { id: "staff-1", name: "John Doe" },
  { id: "staff-2", name: "Sarah Smith" },
  { id: "staff-3", name: "Mike Johnson" },
  { id: "staff-4", name: "Lisa Brown" },
  { id: "staff-5", name: "David Wilson" },
]

// Mock data for projects/sites
const projects = [
  { id: "site-a", name: "Site A - London Office" },
  { id: "site-b", name: "Site B - Manchester Residence" },
  { id: "site-c", name: "Site C - Birmingham Commercial" },
  { id: "site-d", name: "Site D - Edinburgh Hospital" },
]

export function ReportsFilters() {
  const [staffFilter, setStaffFilter] = useState("")
  const [projectFilter, setProjectFilter] = useState("")
  const [reportTypeFilter, setReportTypeFilter] = useState("")

  const clearFilters = () => {
    setStaffFilter("")
    setProjectFilter("")
    setReportTypeFilter("")
  }

  const hasFilters = staffFilter || projectFilter || reportTypeFilter

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Staff Filter */}
          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Staff Member" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
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

          {/* Report Type Filter */}
          <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <BarChart className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Report Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="time">Time Reports</SelectItem>
              <SelectItem value="financial">Financial Reports</SelectItem>
              <SelectItem value="performance">Performance Reports</SelectItem>
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
          {staffFilter && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
            >
              Staff:{" "}
              {staffFilter === "all" ? "All" : staffMembers.find((s) => s.id === staffFilter)?.name || staffFilter}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStaffFilter("")} />
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
          {reportTypeFilter && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
            >
              Type:{" "}
              {reportTypeFilter === "all"
                ? "All"
                : reportTypeFilter.charAt(0).toUpperCase() + reportTypeFilter.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setReportTypeFilter("")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
