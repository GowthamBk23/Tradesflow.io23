"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface Option {
  value: string
  label: string
  disabled?: boolean
}

interface ComboboxProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  className?: string
  allowCustomValue?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  emptyMessage = "No options found.",
  className,
  allowCustomValue = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Focus the input when the popover opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options

    return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [options, searchQuery])

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setOpen(false)
    setSearchQuery("")
  }

  const handleAddCustomValue = () => {
    if (searchQuery.trim()) {
      onChange(searchQuery.trim())
      setOpen(false)
      setSearchQuery("")
    }
  }

  const displayValue = React.useMemo(() => {
    if (!value) return ""
    const option = options.find((option) => option.value === value)
    return option ? option.label : value
  }, [value, options])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", !value && "text-muted-foreground", className)}
        >
          {value ? displayValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <div className="flex items-center border-b px-3">
          <input
            ref={inputRef}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && allowCustomValue && searchQuery.trim()) {
                e.preventDefault()
                handleAddCustomValue()
              }
            }}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <div className="overflow-hidden p-1">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    value === option.value && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  {option.label}
                  {value === option.value && <Check className="ml-auto h-4 w-4" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-sm">
              {allowCustomValue && searchQuery.trim() ? (
                <div
                  className="flex items-center justify-center gap-2 cursor-pointer hover:text-accent-foreground"
                  onClick={handleAddCustomValue}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add "{searchQuery}"</span>
                </div>
              ) : (
                <span className="text-muted-foreground">{emptyMessage}</span>
              )}
            </div>
          )}

          {/* Always show add custom option if allowed and there's a search query */}
          {allowCustomValue && searchQuery.trim() && filteredOptions.length > 0 && (
            <div className="border-t p-2">
              <div
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={handleAddCustomValue}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add "{searchQuery}"</span>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
