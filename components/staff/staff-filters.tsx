"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Wrench, Star, Activity, X } from "lucide-react"

export function StaffFilters() {
  const [role, setRole] = useState<string>("")
  const [skillLevel, setSkillLevel] = useState<string>("")
  const [status, setStatus] = useState<string>("")

  const clearFilters = () => {
    setRole("")
    setSkillLevel("")
    setStatus("")
  }

  const hasFilters = role || skillLevel || status

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Role Filter */}
          <Select value={role} onValueChange={setRole}>
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
              <SelectItem value="foreman">Foreman</SelectItem>
              <SelectItem value="project-manager">Project Manager</SelectItem>
            </SelectContent>
          </Select>

          {/* Skill Level Filter */}
          <Select value={skillLevel} onValueChange={setSkillLevel}>
            <SelectTrigger className="h-9 rounded-2xl w-[140px] border-dashed">
              <div className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Skill Level" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Beginner</SelectItem>
              <SelectItem value="2">Junior</SelectItem>
              <SelectItem value="3">Intermediate</SelectItem>
              <SelectItem value="4">Advanced</SelectItem>
              <SelectItem value="5">Expert</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 rounded-2xl w-[140px] border-dashed">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
          {role && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
            >
              Role: {role.charAt(0).toUpperCase() + role.slice(1).replace("-", " ")}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setRole("")} />
            </Badge>
          )}
          {skillLevel && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
            >
              Skill:{" "}
              {skillLevel === "1"
                ? "Beginner"
                : skillLevel === "2"
                  ? "Junior"
                  : skillLevel === "3"
                    ? "Intermediate"
                    : skillLevel === "4"
                      ? "Advanced"
                      : "Expert"}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSkillLevel("")} />
            </Badge>
          )}
          {status && (
            <Badge
              variant="outline"
              className={`rounded-2xl ${
                status === "active"
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  : "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"
              }`}
            >
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStatus("")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
