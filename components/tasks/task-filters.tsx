"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

interface TaskFiltersProps {
  isStaffView?: boolean
}

export function TaskFilters({ isStaffView = false }: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="search" placeholder="Search tasks..." className="h-9 rounded-2xl" />
        <Button type="submit" size="sm" className="h-9 rounded-2xl">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        {!isStaffView && (
          <Select defaultValue="all">
            <SelectTrigger className="h-9 w-[130px] rounded-2xl border-dashed">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="sarah">Sarah Smith</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
              <SelectItem value="lisa">Lisa Brown</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[130px] rounded-2xl border-dashed">
            <SelectValue placeholder="Job Site" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            <SelectItem value="site-a">Site A</SelectItem>
            <SelectItem value="site-b">Site B</SelectItem>
            <SelectItem value="site-c">Site C</SelectItem>
            <SelectItem value="site-d">Site D</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[130px] rounded-2xl border-dashed">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
