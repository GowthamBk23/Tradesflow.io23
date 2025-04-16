"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CreateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock client data
const clients = [
  { id: "client-1", name: "Oakwood Properties" },
  { id: "client-2", name: "Metro Commercial Ltd" },
  { id: "client-3", name: "Greenfield Developments" },
  { id: "client-4", name: "City Hospital Trust" },
  { id: "client-6", name: "Northside School District" },
  { id: "client-7", name: "TechHub Innovations" },
  { id: "client-8", name: "Thompson Residence" },
  { id: "client-9", name: "Wilson Family Home" },
]

export function CreateInvoiceModal({ isOpen, onClose }: CreateInvoiceModalProps) {
  const { toast } = useToast()
  const [clientId, setClientId] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [issueDate, setIssueDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)))
  const [vatNumber, setVatNumber] = useState("GB123456789")
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }])
  const [notes, setNotes] = useState("")
  const [subtotal, setSubtotal] = useState(0)
  const [vat, setVat] = useState(0)
  const [total, setTotal] = useState(0)

  // Generate invoice number on open
  useEffect(() => {
    if (isOpen) {
      const year = new Date().getFullYear()
      const randomNum = Math.floor(1000 + Math.random() * 9000)
      setInvoiceNumber(`INV-${year}-${randomNum}`)
    }
  }, [isOpen])

  // Calculate totals when items change
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const newVat = newSubtotal * 0.2
    const newTotal = newSubtotal + newVat

    setSubtotal(newSubtotal)
    setVat(newVat)
    setTotal(newTotal)
  }, [items])

  // Update item amount when quantity or rate changes
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]

    if (field === "quantity" || field === "rate") {
      newItems[index][field] = Number.parseFloat(value) || 0
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    } else {
      newItems[index][field] = value
    }

    setItems(newItems)
  }

  // Add new item
  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  // Remove item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    }
  }

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
  }

  // Handle save invoice
  const handleSaveInvoice = (asDraft = false) => {
    if (!clientId) {
      toast({
        title: "Missing Information",
        description: "Please select a client",
        variant: "destructive",
      })
      return
    }

    if (items.some((item) => !item.description)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all item descriptions",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save the invoice to your database
    toast({
      title: asDraft ? "Invoice Saved as Draft" : "Invoice Created",
      description: `Invoice ${invoiceNumber} has been ${asDraft ? "saved as draft" : "created successfully"}`,
    })

    onClose()
  }

  // Handle send via Stripe
  const handleSendViaStripe = () => {
    if (!clientId) {
      toast({
        title: "Missing Information",
        description: "Please select a client",
        variant: "destructive",
      })
      return
    }

    if (items.some((item) => !item.description)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all item descriptions",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would create a Stripe checkout session
    toast({
      title: "Invoice Sent via Stripe",
      description: `Invoice ${invoiceNumber} has been sent to the client via Stripe`,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">
                Client <span className="text-destructive">*</span>
              </Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client" className="rounded-xl">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice-number">
                Invoice Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue-date">
                Issue Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="issue-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl",
                      !issueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {issueDate ? format(issueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={issueDate}
                    onSelect={(date) => date && setIssueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-date">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-xl",
                      !dueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat-number">VAT Number</Label>
              <Input
                id="vat-number"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>
                Line Items <span className="text-destructive">*</span>
              </Label>
              <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Rate (£)</div>
                <div className="col-span-2">Amount (£)</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.rate}
                      onChange={(e) => updateItem(index, "rate", e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input value={formatAmount(item.amount)} readOnly className="rounded-xl bg-muted/50" />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="grid grid-cols-12 gap-2 pt-4 border-t border-border/40">
                <div className="col-span-9 text-right font-medium">Subtotal:</div>
                <div className="col-span-2">
                  <Input value={formatAmount(subtotal)} readOnly className="rounded-xl bg-muted/50" />
                </div>
                <div className="col-span-1"></div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-9 text-right font-medium">VAT (20%):</div>
                <div className="col-span-2">
                  <Input value={formatAmount(vat)} readOnly className="rounded-xl bg-muted/50" />
                </div>
                <div className="col-span-1"></div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-9 text-right font-medium">Total:</div>
                <div className="col-span-2">
                  <Input value={formatAmount(total)} readOnly className="rounded-xl bg-muted/50 font-bold" />
                </div>
                <div className="col-span-1"></div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes or payment terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] rounded-xl"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => handleSaveInvoice(true)}>
            Save as Draft
          </Button>
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => handleSaveInvoice(false)}>
            Save & Send Later
          </Button>
          <Button type="button" className="rounded-xl" onClick={handleSendViaStripe}>
            Send via Stripe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
