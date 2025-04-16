"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CreditCard, Building, Banknote, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethodSelectorProps {
  isOpen: boolean
  onClose: () => void
  invoice: any
  onPaymentComplete: (invoice: any, method: string) => void
}

export function PaymentMethodSelector({ isOpen, onClose, invoice, onPaymentComplete }: PaymentMethodSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe")
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const { toast } = useToast()

  if (!invoice) return null

  // Format amount
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
  }

  // Handle payment method selection
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
  }

  // Handle payment process
  const handlePayment = () => {
    if (paymentMethod === "stripe") {
      // In a real app, this would redirect to Stripe Checkout
      window.open("https://checkout.stripe.com", "_blank")
      toast({
        title: "Redirecting to Stripe",
        description: "You will be redirected to Stripe to complete your payment.",
      })
      onClose()
    } else if (paymentMethod === "bank") {
      setIsConfirmationOpen(true)
    } else if (paymentMethod === "cash") {
      setIsConfirmationOpen(true)
    }
  }

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    onPaymentComplete(invoice, paymentMethod)
    setIsConfirmationOpen(false)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Pay Invoice #{invoice.id}</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount Due:</span>
              <span className="text-xl font-bold">{formatAmount(invoice.amount)}</span>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange} className="space-y-3">
              <div
                className="flex items-center space-x-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setPaymentMethod("stripe")}
              >
                <RadioGroupItem value="stripe" id="stripe" />
                <Label htmlFor="stripe" className="flex-1 flex items-center cursor-pointer">
                  <CreditCard className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Pay with Card (Stripe)</p>
                    <p className="text-sm text-muted-foreground">Secure payment via Stripe</p>
                  </div>
                </Label>
              </div>

              <div
                className="flex items-center space-x-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setPaymentMethod("bank")}
              >
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex-1 flex items-center cursor-pointer">
                  <Building className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">Pay via bank transfer</p>
                  </div>
                </Label>
              </div>

              <div
                className="flex items-center space-x-2 rounded-xl border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setPaymentMethod("cash")}
              >
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex-1 flex items-center cursor-pointer">
                  <Banknote className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium">Cash Payment</p>
                    <p className="text-sm text-muted-foreground">Pay in cash</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "bank" && (
              <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Bank Transfer Details</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-medium">Trades Flow Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-medium">12345678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sort Code:</span>
                    <span className="font-medium">12-34-56</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference:</span>
                    <span className="font-medium">{invoice.id}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <CardDescription>Please use the invoice ID as the payment reference.</CardDescription>
                </CardFooter>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handlePayment} className="rounded-xl">
              {paymentMethod === "stripe" ? "Pay with Stripe" : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="bg-green-500/10 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p>
                Are you sure you want to mark invoice #{invoice.id} as paid via{" "}
                {paymentMethod === "bank" ? "bank transfer" : "cash"}?
              </p>
              <p className="text-sm text-muted-foreground">
                This will update the invoice status to "Paid" and record your payment method.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment} className="rounded-xl">
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
