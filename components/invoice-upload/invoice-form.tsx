"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, X, Plus, Trash2, Save } from "lucide-react"

interface InvoiceFormProps {
  file: File | null
  initialData: any
  onRemoveFile: () => void
  onSubmit: (data: any) => void
}

export function InvoiceForm({ file, initialData, onRemoveFile, onSubmit }: InvoiceFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [lineItems, setLineItems] = useState(initialData.lineItems || [])

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Update line item
  const updateLineItem = (index: number, field: string, value: any) => {
    const updatedItems = [...lineItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }
    setLineItems(updatedItems)
  }

  // Add new line item
  const addLineItem = () => {
    setLineItems([...lineItems, { description: "", amount: "0.00" }])
  }

  // Remove line item
  const removeLineItem = (index: number) => {
    const updatedItems = [...lineItems]
    updatedItems.splice(index, 1)
    setLineItems(updatedItems)
  }

  // Calculate total
  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + Number.parseFloat(item.amount || 0), 0).toFixed(2)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      lineItems,
      amount: calculateTotal(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Preview */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div className="text-left">
            <p className="font-medium truncate max-w-[300px]">{file?.name}</p>
            <p className="text-xs text-muted-foreground">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive"
          onClick={onRemoveFile}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invoice Number */}
        <div className="space-y-2">
          <Label htmlFor="invoice-number">Invoice Number</Label>
          <Input
            id="invoice-number"
            value={formData.invoiceNumber}
            onChange={(e) => updateField("invoiceNumber", e.target.value)}
            className="rounded-xl"
          />
        </div>

        {/* Vendor / Supplier */}
        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor / Supplier</Label>
          <Input
            id="vendor"
            value={formData.vendor}
            onChange={(e) => updateField("vendor", e.target.value)}
            className="rounded-xl"
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => updateField("date", e.target.value)}
            className="rounded-xl"
          />
        </div>

        {/* Total Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount">Total Amount (£)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={calculateTotal()}
            readOnly
            className="rounded-xl bg-muted/50"
          />
          <p className="text-xs text-muted-foreground">Total is calculated from line items</p>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Line Items</Label>
          <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={addLineItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => updateLineItem(index, "amount", e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive"
                onClick={() => removeLineItem(index)}
                disabled={lineItems.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about this invoice..."
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          className="rounded-xl min-h-[100px]"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" className="rounded-xl">
          <Save className="h-4 w-4 mr-2" />
          Confirm & Save
        </Button>
      </div>
    </form>
  )
}
