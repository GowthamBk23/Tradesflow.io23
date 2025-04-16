"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "../invoices/date-range-picker"
import { subDays } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReportsHeader() {
  // Default date range: last 30 days
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const [quickRange, setQuickRange] = useState("30")

  // Handle quick range selection
  const handleQuickRangeChange = (value: string) => {
    setQuickRange(value)

    const today = new Date()
    let from: Date

    switch (value) {
      case "7":
        from = subDays(today, 7)
        break
      case "30":
        from = subDays(today, 30)
        break
      case "90":
        from = subDays(today, 90)
        break
      case "year":
        from = new Date(today.getFullYear(), 0, 1) // January 1st of current year
        break
      default:
        from = subDays(today, 30)
    }

    setDateRange({ from, to: today })
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and analyze your business performance</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Quick Date Range Selector */}
        <Select value={quickRange} onValueChange={handleQuickRangeChange}>
          <SelectTrigger className="w-[140px] rounded-2xl">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 Days</SelectItem>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Date Range Picker */}
        <div className="h-10 rounded-2xl border border-input px-3 flex items-center">
          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
          <DatePickerWithRange
            date={dateRange}
            setDate={(range) => {
              setDateRange(range)
              setQuickRange("custom")
            }}
          />
        </div>
      </div>
    </div>
  )
}
