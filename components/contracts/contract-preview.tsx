"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, Download, Edit, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContractPreviewProps {
  formData: any
  onBack: () => void
  onSave: () => void
}

export function ContractPreview({ formData, onBack, onSave }: ContractPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContract, setEditedContract] = useState("")
  const [activeTab, setActiveTab] = useState("preview")
  const { toast } = useToast()

  // Format dates
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy")
  }

  // Generate contract text
  const generateContractText = () => {
    return `# ${formData.title}

## AGREEMENT

This agreement is made on ${format(new Date(), "MMMM d, yyyy")} between:

**SERVICE PROVIDER:** Trades Flow Ltd
**CLIENT:** ${formData.clientName}

## PROJECT DETAILS

**Project/Site:** ${formData.projectName}
**Start Date:** ${formatDate(formData.startDate)}
**End Date:** ${formatDate(formData.endDate)}

## SCOPE OF WORK

${formData.scopeOfWork}

## DELIVERABLES

${formData.deliverables}

## PAYMENT TERMS

${formData.paymentTermsText}

## CANCELLATION POLICY

${formData.cancellationPolicyText}

${formData.additionalNotes ? `## ADDITIONAL NOTES\n\n${formData.additionalNotes}` : ""}

## SIGNATURES

This agreement constitutes the entire understanding between the parties with respect to the subject matter of this agreement and supersedes all prior agreements, negotiations and discussions between the parties relating to it.

**SERVICE PROVIDER:**
Trades Flow Ltd
Signature: ____________________
Date: ____________________

**CLIENT:**
${formData.clientName}
Signature: ____________________
Date: ____________________
`
  }

  // Initialize contract text
  const contractText = generateContractText()

  // Handle edit toggle
  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedContract(contractText)
    }
    setIsEditing(!isEditing)
  }

  // Handle text change in editor
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContract(e.target.value)
  }

  // Handle save and send
  const handleSaveAndSend = () => {
    toast({
      title: "Contract Created",
      description: "Contract has been created and sent to the client.",
    })
    onSave()
  }

  // Handle download as PDF
  const handleDownload = () => {
    toast({
      title: "Contract Downloaded",
      description: "Contract has been downloaded as PDF.",
    })
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Contract Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-xl mb-6">
              <TabsTrigger value="preview" className="rounded-xl">
                Preview
              </TabsTrigger>
              <TabsTrigger value="raw" className="rounded-xl">
                Raw Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-6">
              <div className="bg-white text-black rounded-xl p-8 shadow-md max-h-[600px] overflow-y-auto">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold">{formData.title}</h1>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">AGREEMENT</h2>
                  <p>This agreement is made on {format(new Date(), "MMMM d, yyyy")} between:</p>
                  <p className="mt-2">
                    <strong>SERVICE PROVIDER:</strong> Trades Flow Ltd
                    <br />
                    <strong>CLIENT:</strong> {formData.clientName}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">PROJECT DETAILS</h2>
                  <p>
                    <strong>Project/Site:</strong> {formData.projectName}
                    <br />
                    <strong>Start Date:</strong> {formatDate(formData.startDate)}
                    <br />
                    <strong>End Date:</strong> {formatDate(formData.endDate)}
                  </p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">SCOPE OF WORK</h2>
                  <p className="whitespace-pre-line">{formData.scopeOfWork}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">DELIVERABLES</h2>
                  <p className="whitespace-pre-line">{formData.deliverables}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">PAYMENT TERMS</h2>
                  <p className="whitespace-pre-line">{formData.paymentTermsText}</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">CANCELLATION POLICY</h2>
                  <p className="whitespace-pre-line">{formData.cancellationPolicyText}</p>
                </div>

                {formData.additionalNotes && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">ADDITIONAL NOTES</h2>
                    <p className="whitespace-pre-line">{formData.additionalNotes}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">SIGNATURES</h2>
                  <p className="mb-4">
                    This agreement constitutes the entire understanding between the parties with respect to the subject
                    matter of this agreement and supersedes all prior agreements, negotiations and discussions between
                    the parties relating to it.
                  </p>

                  <div className="grid grid-cols-2 gap-8 mt-8">
                    <div>
                      <p>
                        <strong>SERVICE PROVIDER:</strong>
                      </p>
                      <p>Trades Flow Ltd</p>
                      <p className="mt-4">Signature: ____________________</p>
                      <p>Date: ____________________</p>
                    </div>
                    <div>
                      <p>
                        <strong>CLIENT:</strong>
                      </p>
                      <p>{formData.clientName}</p>
                      <p className="mt-4">Signature: ____________________</p>
                      <p>Date: ____________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="raw" className="space-y-6">
              {isEditing ? (
                <Textarea
                  value={editedContract}
                  onChange={handleTextChange}
                  className="font-mono text-sm h-[600px] rounded-xl"
                />
              ) : (
                <div className="bg-muted/30 font-mono text-sm p-4 rounded-xl whitespace-pre-wrap h-[600px] overflow-y-auto">
                  {contractText}
                </div>
              )}

              <Button onClick={handleEditToggle} variant="outline" className="rounded-xl">
                {isEditing ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Contract
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Form
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload} className="rounded-xl">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleSaveAndSend} className="rounded-xl">
              <Send className="h-4 w-4 mr-2" />
              Save & Send to Client
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
