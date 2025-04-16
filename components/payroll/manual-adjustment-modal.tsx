"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ManualAdjustmentModalProps {
  payroll: any
  open: boolean
  onClose: () => void
}

export function ManualAdjustmentModal({ payroll, open, onClose }: ManualAdjustmentModalProps) {
  const [adjustments, setAdjustments] = useState({
    hours: payroll.totalHours.toString(),
    rate: payroll.hourlyRate.toString(),
    bonusAmount: "",
    bonusReason: "",
    deductionAmount: "",
    deductionReason: "",
  })

  const [bonusType, setBonusType] = useState("performance")
  const [deductionType, setDeductionType] = useState("absence")

  // Calculate adjusted gross pay
  const calculateAdjustedPay = () => {
    const hours = Number.parseFloat(adjustments.hours) || 0
    const rate = Number.parseFloat(adjustments.rate) || 0
    const bonus = Number.parseFloat(adjustments.bonusAmount) || 0
    const deduction = Number.parseFloat(adjustments.deductionAmount) || 0

    return hours * rate + bonus - deduction
  }

  const handleInputChange = (field: string, value: string) => {
    setAdjustments((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // In a real app, this would save the adjustments to the backend
    console.log("Saving adjustments:", {
      payrollId: payroll.id,
      adjustments,
      bonusType,
      deductionType,
      adjustedGrossPay: calculateAdjustedPay(),
    })

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manual Adjustment</DialogTitle>
          <DialogDescription>Adjust payroll details for {payroll.staffName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Hours and Rate Adjustment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Total Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                step="0.5"
                value={adjustments.hours}
                onChange={(e) => handleInputChange("hours", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Hourly Rate (£)</Label>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                value={adjustments.rate}
                onChange={(e) => handleInputChange("rate", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Bonus Section */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Plus className="mr-2 h-4 w-4 text-green-500" />
              <Label>Add Bonus</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bonus-type">Bonus Type</Label>
                <Select value={bonusType} onValueChange={setBonusType}>
                  <SelectTrigger id="bonus-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="overtime">Overtime</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bonus-amount">Amount (£)</Label>
                <Input
                  id="bonus-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={adjustments.bonusAmount}
                  onChange={(e) => handleInputChange("bonusAmount", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonus-reason">Reason</Label>
              <Textarea
                id="bonus-reason"
                placeholder="Reason for bonus"
                value={adjustments.bonusReason}
                onChange={(e) => handleInputChange("bonusReason", e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Deduction Section */}
          <div className="space-y-2">
            <div className="flex items-center">
              <Minus className="mr-2 h-4 w-4 text-red-500" />
              <Label>Add Deduction</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deduction-type">Deduction Type</Label>
                <Select value={deductionType} onValueChange={setDeductionType}>
                  <SelectTrigger id="deduction-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="absence">Absence</SelectItem>
                    <SelectItem value="advance">Advance</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deduction-amount">Amount (£)</Label>
                <Input
                  id="deduction-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={adjustments.deductionAmount}
                  onChange={(e) => handleInputChange("deductionAmount", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deduction-reason">Reason</Label>
              <Textarea
                id="deduction-reason"
                placeholder="Reason for deduction"
                value={adjustments.deductionReason}
                onChange={(e) => handleInputChange("deductionReason", e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Adjusted Pay Summary */}
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Original Gross Pay:</p>
              <p className="font-medium">£{payroll.grossPay.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Adjusted Gross Pay:</p>
              <p className="text-lg font-bold">£{calculateAdjustedPay().toFixed(2)}</p>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Adjustments will be logged in the system for audit purposes.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Adjustments</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
