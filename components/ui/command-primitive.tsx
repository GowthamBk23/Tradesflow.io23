"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// This is a simplified version of the command primitive
// that doesn't rely on the external cmdk package

interface CommandContextValue {
  selectedValue: string | null
  setSelectedValue: (value: string | null) => void
}

const CommandContext = React.createContext<CommandContextValue>({
  selectedValue: null,
  setSelectedValue: () => {},
})

interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(({ className, children, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null)

  return (
    <CommandContext.Provider value={{ selectedValue, setSelectedValue }}>
      <div ref={ref} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </CommandContext.Provider>
  )
})
Command.displayName = "Command"

// Create a namespace object for Command
const CommandNamespace = Object.assign(Command, {
  Input: undefined as unknown as typeof CommandInput,
  List: undefined as unknown as typeof CommandList,
  Empty: undefined as unknown as typeof CommandEmpty,
  Group: undefined as unknown as typeof CommandGroup,
  Item: undefined as unknown as typeof CommandItem,
  Separator: undefined as unknown as typeof CommandSeparator,
})

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn("w-full", className)} {...props} />
})
CommandInput.displayName = "CommandInput"
CommandNamespace.Input = CommandInput

interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("overflow-auto", className)} {...props} />
})
CommandList.displayName = "CommandList"
CommandNamespace.List = CommandList

interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("py-2 text-center", className)} {...props} />
})
CommandEmpty.displayName = "CommandEmpty"
CommandNamespace.Empty = CommandEmpty

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("py-1", className)} {...props} />
})
CommandGroup.displayName = "CommandGroup"
CommandNamespace.Group = CommandGroup

interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("h-px bg-border", className)} {...props} />
})
CommandSeparator.displayName = "CommandSeparator"
CommandNamespace.Separator = CommandSeparator

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onSelect?: (value: string) => void
  disabled?: boolean
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value, onSelect, disabled = false, children, ...props }, ref) => {
    const { selectedValue, setSelectedValue } = React.useContext(CommandContext)
    const isSelected = selectedValue === value

    const handleClick = () => {
      if (disabled) return
      if (value) {
        setSelectedValue(value)
        onSelect?.(value)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "px-2 py-1.5 text-sm cursor-pointer rounded-sm",
          isSelected && "bg-accent text-accent-foreground",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
        onClick={handleClick}
        aria-selected={isSelected}
        data-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </div>
    )
  },
)
CommandItem.displayName = "CommandItem"
CommandNamespace.Item = CommandItem

// Export the namespace as Command
export { CommandNamespace as Command }
