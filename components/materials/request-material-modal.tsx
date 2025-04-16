"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/contexts/user-context"

interface RequestMaterialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isStaffView?: boolean
}

export default function RequestMaterialModal({ open, onOpenChange, isStaffView = false }: RequestMaterialModalProps) {
  const { user } = useUser()
  const { toast } = useToast()
  const [materials, setMaterials] = useState([{ name: "", quantity: "", unit: "units" }])
  const [site, setSite] = useState("")
  const [notes, setNotes] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")

  // Get available sites based on user role
  const getAvailableSites = () => {
    if (isStaffView) {
      // For staff, only show assigned sites
      return [
        { id: "site-a", name: "Site A - London Office" },
        { id: "site-c", name: "Site C - Birmingham Commercial" },
      ]
    } else {
      // For admin, show all sites
      return [
        { id: "site-a", name: "Site A - London Office" },
        { id: "site-b", name: "Site B - Manchester Residence" },
        { id: "site-c", name: "Site C - Birmingham Commercial" },
        { id: "site-d", name: "Site D - Edinburgh Hospital" },
      ]
    }
  }

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: "", quantity: "", unit: "units" }])
  }

  const handleRemoveMaterial = (index: number) => {
    const newMaterials = [...materials]
    newMaterials.splice(index, 1)
    setMaterials(newMaterials)
  }

  const handleMaterialChange = (index: number, field: string, value: string) => {
    const newMaterials = [...materials]
    newMaterials[index] = { ...newMaterials[index], [field]: value }
    setMaterials(newMaterials)
  }

  const handleSubmit = () => {
    // Validate form
    if (!site) {
      toast({
        title: "Missing Information",
        description: "Please select a site location",
        variant: "destructive",
      })
      return
    }

    const invalidMaterials = materials.some((m) => !m.name || !m.quantity)
    if (invalidMaterials) {
      toast({
        title: "Missing Information",
        description: "Please fill in all material names and quantities",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would submit to an API
    toast({
      title: "Request Submitted",
      description: "Your material request has been submitted successfully",
    })

    // Reset form and close modal
    setMaterials([{ name: "", quantity: "", unit: "units" }])
    setSite("")
    setNotes("")
    setDeliveryDate("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Materials</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="site" className="text-right">
              Site Location
            </Label>
            <div className="col-span-3">
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger id="site">
                  <SelectValue placeholder="Select site location" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableSites().map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Materials</Label>
            <div className="col-span-3 space-y-2">
              {materials.map((material, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Material name"
                    value={material.name}
                    onChange={(e) => handleMaterialChange(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={material.quantity}
                    onChange={(e) => handleMaterialChange(index, "quantity", e.target.value)}
                    className="w-20"
                  />
                  <Select value={material.unit} onValueChange={(value) => handleMaterialChange(index, "unit", value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="units">Units</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="sheets">Sheets</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="gallons">Gallons</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                  {materials.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMaterial(index)}
                      className="h-8 w-8 rounded-full"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddMaterial} className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="delivery-date" className="text-right">
              Needed By
            </Label>
            <div className="col-span-3">
              <Input
                id="delivery-date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="notes" className="text-right pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional information about this request"
              className="col-span-3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Package className="mr-2 h-4 w-4" />
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
