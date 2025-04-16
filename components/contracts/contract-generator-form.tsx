"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for clients
const clients = [
  { id: "client-1", name: "Oakwood Properties" },
  { id: "client-2", name: "Metro Commercial Ltd" },
  { id: "client-3", name: "Greenfield Developments" },
  { id: "client-4", name: "City Hospital Trust" },
  { id: "client-8", name: "Thompson Residence" },
  { id: "client-9", name: "Wilson Family Home" },
]

// Mock data for projects/sites
const projects = [
  { id: "site-a", name: "Site A - London Office", clientId: "client-1" },
  { id: "site-b", name: "Site B - Manchester Residence", clientId: "client-2" },
  { id: "site-c", name: "Site C - Birmingham Commercial", clientId: "client-3" },
  { id: "site-d", name: "Site D - Edinburgh Hospital", clientId: "client-4" },
  { id: "site-e", name: "Site E - Thompson Kitchen", clientId: "client-8" },
  { id: "site-f", name: "Site F - Wilson Bathroom", clientId: "client-9" },
]

// Payment terms options
const paymentTermsOptions = [
  { value: "50-50", label: "50% upfront, 50% on completion" },
  { value: "30-40-30", label: "30% upfront, 40% midway, 30% on completion" },
  { value: "monthly", label: "Monthly installments" },
  { value: "completion", label: "100% on completion" },
  { value: "custom", label: "Custom payment terms" },
]

// Cancellation policy options
const cancellationPolicyOptions = [
  { value: "standard", label: "Standard (14 days notice, 25% fee)" },
  { value: "strict", label: "Strict (30 days notice, 50% fee)" },
  { value: "flexible", label: "Flexible (7 days notice, 10% fee)" },
  { value: "custom", label: "Custom cancellation policy" },
]

// Form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Contract title must be at least 5 characters" }),
  clientId: z.string().min(1, { message: "Please select a client" }),
  projectId: z.string().min(1, { message: "Please select a project/site" }),
  startDate: z.date({ required_error: "Please select a start date" }),
  endDate: z.date({ required_error: "Please select an end date" }),
  paymentTerms: z.string().min(1, { message: "Please select payment terms" }),
  customPaymentTerms: z.string().optional(),
  scopeOfWork: z.string().min(10, { message: "Scope of work must be at least 10 characters" }),
  deliverables: z.string().min(10, { message: "Deliverables must be at least 10 characters" }),
  cancellationPolicy: z.string().min(1, { message: "Please select a cancellation policy" }),
  customCancellationPolicy: z.string().optional(),
  additionalNotes: z.string().optional(),
})

interface ContractGeneratorFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void
}

export function ContractGeneratorForm({ onSubmit }: ContractGeneratorFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [selectedClientId, setSelectedClientId] = useState<string>("")

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      clientId: "",
      projectId: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      paymentTerms: "",
      customPaymentTerms: "",
      scopeOfWork: "",
      deliverables: "",
      cancellationPolicy: "",
      customCancellationPolicy: "",
      additionalNotes: "",
    },
  })

  // Filter projects based on selected client
  const filteredProjects = selectedClientId
    ? projects.filter((project) => project.clientId === selectedClientId)
    : projects

  // Handle client selection change
  const handleClientChange = (value: string) => {
    setSelectedClientId(value)
    form.setValue("clientId", value)
    form.setValue("projectId", "")
  }

  // Handle form submission
  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    // Get client and project names
    const client = clients.find((c) => c.id === data.clientId)
    const project = projects.find((p) => p.id === data.projectId)

    // Prepare data with names included
    const enrichedData = {
      ...data,
      clientName: client?.name || "",
      projectName: project?.name || "",
      // Handle custom fields
      paymentTermsText:
        data.paymentTerms === "custom"
          ? data.customPaymentTerms
          : paymentTermsOptions.find((opt) => opt.value === data.paymentTerms)?.label || "",
      cancellationPolicyText:
        data.cancellationPolicy === "custom"
          ? data.customCancellationPolicy
          : cancellationPolicyOptions.find((opt) => opt.value === data.cancellationPolicy)?.label || "",
    }

    onSubmit(enrichedData)
  }

  return (
    <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Contract Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-xl mb-6">
            <TabsTrigger value="basic" className="rounded-xl">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="terms" className="rounded-xl">
              Terms & Scope
            </TabsTrigger>
            <TabsTrigger value="additional" className="rounded-xl">
              Additional Details
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contract title" className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select onValueChange={handleClientChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project/Site</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClientId}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue
                              placeholder={selectedClientId ? "Select a project/site" : "Select a client first"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal rounded-xl",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal rounded-xl",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("terms")} className="rounded-xl">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Terms & Scope Tab */}
              <TabsContent value="terms" className="space-y-6">
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {paymentTermsOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("paymentTerms") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customPaymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Payment Terms</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your custom payment terms"
                            className="rounded-xl min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="scopeOfWork"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scope of Work</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the scope of work in detail"
                          className="rounded-xl min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Clearly outline what work will be performed under this contract.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliverables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deliverables</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List all deliverables that will be provided"
                          className="rounded-xl min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Specify all tangible and intangible items that will be delivered to the client.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")} className="rounded-xl">
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("additional")} className="rounded-xl">
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              {/* Additional Details Tab */}
              <TabsContent value="additional" className="space-y-6">
                <FormField
                  control={form.control}
                  name="cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Policy</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select cancellation policy" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cancellationPolicyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("cancellationPolicy") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customCancellationPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Cancellation Policy</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your custom cancellation policy"
                            className="rounded-xl min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional terms, conditions, or notes"
                          className="rounded-xl min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include any other information that should be part of the contract.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("terms")} className="rounded-xl">
                    Back
                  </Button>
                  <Button type="submit" className="rounded-xl">
                    Generate Contract
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}
