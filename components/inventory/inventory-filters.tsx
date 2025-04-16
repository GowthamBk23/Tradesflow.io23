"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function InventoryFilters() {
  const [site, setSite] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [availability, setAvailability] = useState<string>("")
  const [search, setSearch] = useState<string>("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSiteChange = (value: string) => {
    setSite(value)
    updateActiveFilters("site", value)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateActiveFilters("category", value)
  }

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value)
    updateActiveFilters("availability", value)
  }

  const updateActiveFilters = (type: string, value: string) => {
    if (value) {
      setActiveFilters((prev) => {
        const filtered = prev.filter((filter) => !filter.startsWith(type))
        return [...filtered, `${type}:${value}`]
      })
    } else {
      setActiveFilters((prev) => prev.filter((filter) => !filter.startsWith(type)))
    }
  }

  const removeFilter = (filter: string) => {
    const [type] = filter.split(":")
    setActiveFilters((prev) => prev.filter((f) => f !== filter))

    // Reset the corresponding state
    if (type === "site") setSite("")
    if (type === "category") setCategory("")
    if (type === "availability") setAvailability("")
  }

  const clearAllFilters = () => {
    setSite("")
    setCategory("")
    setAvailability("")
    setSearch("")
    setActiveFilters([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={site} onValueChange={handleSiteChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Sites" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sites</SelectItem>
            <SelectItem value="site-a">Site A</SelectItem>
            <SelectItem value="site-b">Site B</SelectItem>
            <SelectItem value="site-c">Site C</SelectItem>
            <SelectItem value="warehouse">Warehouse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
            <SelectItem value="ppe">PPE</SelectItem>
            <SelectItem value="materials">Materials</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="consumables">Consumables</SelectItem>
          </SelectContent>
        </Select>
        <Select value={availability} onValueChange={handleAvailabilityChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availability</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => {
            const [type, value] = filter.split(":")
            let label = ""

            if (type === "site") {
              label =
                value === "site-a"
                  ? "Site A"
                  : value === "site-b"
                    ? "Site B"
                    : value === "site-c"
                      ? "Site C"
                      : "Warehouse"
            } else if (type === "category") {
              label = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ")
            } else if (type === "availability") {
              label = value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
            }

            return (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                {type.charAt(0).toUpperCase() + type.slice(1)}: {label}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => removeFilter(filter)}>
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {type} filter</span>
                </Button>
              </Badge>
            )
          })}
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllFilters}>
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
