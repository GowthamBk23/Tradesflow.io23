"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"
import { SignInForm } from "@/components/auth/sign-in-form"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { FeatureHighlights } from "@/components/auth/feature-highlights"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("sign-in")
  const router = useRouter()

  const handleSignUp = (data: any) => {
    console.log("Sign up data:", data)
    // In a real app, you would handle the sign-up process here
    router.push("/subscribe")
  }

  const handleSignIn = (data: any) => {
    console.log("Sign in data:", data)
    // In a real app, you would handle the sign-in process here
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Auth Form Section */}
      <div className="flex w-full md:w-1/2 flex-col p-4 md:p-8 lg:p-12">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <ModeToggle />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                TradesFlow
              </h1>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold mt-6">
              {activeTab === "sign-in" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {activeTab === "sign-in"
                ? "Sign in to your account to continue"
                : "Start your 14-day free trial, no credit card required"}
            </p>
          </div>

          <Tabs defaultValue="sign-in" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="sign-in" className="rounded-xl">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="sign-up" className="rounded-xl">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <SignInForm onSubmit={handleSignIn} />
            </TabsContent>
            <TabsContent value="sign-up">
              <SignUpForm onSubmit={handleSignUp} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Preview Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500/10 to-teal-400/10 border-l border-border/40">
        <div className="flex flex-col justify-center p-8 lg:p-12 w-full max-w-2xl mx-auto">
          <FeatureHighlights />
        </div>
      </div>
    </div>
  )
}
