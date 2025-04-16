"use client"

import { useState } from "react"
import { Check, Copy, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function ReferralProgram() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // In a real app, this would be generated on the server
  // and would include the user's unique referral code
  const referralLink = "https://tradesflow.com/signup?ref=YOUR_UNIQUE_CODE"

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "Referral link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join TradesFlow",
          text: "I'm using TradesFlow to manage my trade business. Join using my referral link and we'll both get a free month!",
          url: referralLink,
        })
        toast({
          title: "Shared successfully",
          description: "Your referral link has been shared.",
        })
      } catch (err) {
        toast({
          title: "Sharing failed",
          description: "Please try again or copy the link manually.",
          variant: "destructive",
        })
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Program</CardTitle>
        <CardDescription>Share TradesFlow with other trade businesses and earn rewards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-medium mb-2">How it works</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Share your unique referral link with other trade business owners</li>
            <li>When they sign up and subscribe for at least 3 months</li>
            <li>You both get one month of TradesFlow for free!</li>
          </ol>
        </div>

        <div className="space-y-2">
          <label htmlFor="referral-link" className="text-sm font-medium">
            Your Referral Link
          </label>
          <div className="flex space-x-2">
            <Input id="referral-link" value={referralLink} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy referral link">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="font-medium mb-2">Your Referral Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Successful Referrals</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Free Months Earned</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={shareReferralLink}>
          <Share2 className="mr-2 h-4 w-4" />
          Share Your Referral Link
        </Button>
      </CardFooter>
    </Card>
  )
}
