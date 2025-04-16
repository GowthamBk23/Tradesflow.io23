"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ContractGeneratorForm } from "@/components/contracts/contract-generator-form"
import { ContractPreview } from "@/components/contracts/contract-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateContractPage() {
  const [step, setStep] = useState<"form" | "preview">("form")
  const [formData, setFormData] = useState<any>(null)
  const router = useRouter()

  const handleFormSubmit = (data: any) => {
    setFormData(data)
    setStep("preview")
  }

  const handleBack = () => {
    setStep("form")
  }

  const handleSave = () => {
    // In a real app, this would save the contract to your backend
    // For now, we'll just redirect back to the contracts page
    router.push("/dashboard/contracts")
  }

  return (
    <DashboardShell>
      <DashboardHeader>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.push("/dashboard/contracts")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Contract</h1>
            <p className="text-muted-foreground">
              {step === "form" ? "Fill in the details to generate a contract" : "Review and finalize your contract"}
            </p>
          </div>
        </div>
      </DashboardHeader>

      <div className="space-y-6">
        {step === "form" ? (
          <ContractGeneratorForm onSubmit={handleFormSubmit} />
        ) : (
          <ContractPreview formData={formData} onBack={handleBack} onSave={handleSave} />
        )}
      </div>
    </DashboardShell>
  )
}
