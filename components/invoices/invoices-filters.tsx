"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, Users, Calendar, CreditCard, X } from "lucide-react"
import { DatePickerWithRange } from "./date-range-picker"

export function InvoicesFilters() {
  const [client, setClient] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const clearFilters = () => {
    setClient("")
    setStatus("")
    setDateRange({ from: undefined, to: undefined })
  }

  const hasFilters = client || status || dateRange.from || dateRange.to

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Client Filter */}
          <Select value={client} onValueChange={setClient}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Client" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              <SelectItem value="oakwood">Oakwood Properties</SelectItem>
              <SelectItem value="metro">Metro Commercial Ltd</SelectItem>
              <SelectItem value="greenfield">Greenfield Developments</SelectItem>
              <SelectItem value="city-hospital">City Hospital Trust</SelectItem>
              <SelectItem value="techhub">TechHub Innovations</SelectItem>
              <SelectItem value="thompson">Thompson Residence</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <div className="h-9 rounded-2xl border border-dashed border-input px-3 flex items-center">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground mr-2" />
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

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
          {client && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
            >
              Client: {client === "all" ? "All" : client.charAt(0).toUpperCase() + client.slice(1).replace("-", " ")}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setClient("")} />
            </Badge>
          )}
          {status && (
            <Badge
              variant="outline"
              className={`rounded-2xl ${
                status === "paid"
                  ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                  : status === "unpaid"
                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                    : status === "overdue"
                      ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20"
                      : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
              }`}
            >
              Status: {status.charAt(0).toUpperCase() + status.slice(1)}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setStatus("")} />
            </Badge>
          )}
          {(dateRange.from || dateRange.to) && (
            <Badge
              variant="outline"
              className="rounded-2xl bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20"
            >
              Date Range: {dateRange.from ? dateRange.from.toLocaleDateString() : "Any"} -{" "}
              {dateRange.to ? dateRange.to.toLocaleDateString() : "Any"}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => setDateRange({ from: undefined, to: undefined })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
