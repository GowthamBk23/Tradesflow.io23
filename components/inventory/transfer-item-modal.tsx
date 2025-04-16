"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface TransferItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
}

export default function TransferItemModal({ open, onOpenChange, item }: TransferItemModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    quantity: 1,
    destinationSite: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, this would send data to the server
    console.log("Transferring item:", {
      itemId: item.id,
      sourceSite: item.site,
      ...formData,
    })

    toast({
      title: "Item transferred",
      description: `${formData.quantity} ${item.name} transferred to ${getDestinationSiteName(formData.destinationSite)}.`,
    })

    onOpenChange(false)
  }

  const getDestinationSiteName = (siteId: string) => {
    switch (siteId) {
      case "site-a":
        return "Site A"
      case "site-b":
        return "Site B"
      case "site-c":
        return "Site C"
      case "warehouse":
        return "Warehouse"
      default:
        return siteId
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Item</Label>
              <div className="rounded-md border p-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Current Location</Label>
                <div className="rounded-md border p-2">
                  <p>{item.siteName}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Available Quantity</Label>
                <div className="rounded-md border p-2">
                  <p>{item.quantity}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Transfer Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="destinationSite">Destination Site</Label>
                <Select
                  value={formData.destinationSite}
                  onValueChange={(value) => handleSelectChange("destinationSite", value)}
                >
                  <SelectTrigger id="destinationSite">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {item.site !== "site-a" && <SelectItem value="site-a">Site A</SelectItem>}
                    {item.site !== "site-b" && <SelectItem value="site-b">Site B</SelectItem>}
                    {item.site !== "site-c" && <SelectItem value="site-c">Site C</SelectItem>}
                    {item.site !== "warehouse" && <SelectItem value="warehouse">Warehouse</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional information about this transfer"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.destinationSite || formData.quantity < 1 || formData.quantity > item.quantity}
            >
              Transfer Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
