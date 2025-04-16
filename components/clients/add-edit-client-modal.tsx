"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AddEditClientModalProps {
  isOpen: boolean
  onClose: () => void
  client: any
  onSave?: (clientData: any) => void
}

export function AddEditClientModal({ isOpen, onClose, client, onSave }: AddEditClientModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    notes: "",
    status: true, // true = active, false = inactive
    clientType: "company",
    tags: [] as string[],
    address: {
      street: "",
      city: "",
      postalCode: "",
      county: "",
      country: "United Kingdom",
    },
  })

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedTag, setSelectedTag] = useState("")
  const { toast } = useToast()

  // Available tags
  const availableTags = [
    { value: "vip", label: "VIP Client" },
    { value: "follow-up", label: "Needs Follow-Up" },
    { value: "late-payer", label: "Late Payer" },
    { value: "new", label: "New Client" },
    { value: "potential", label: "Potential Growth" },
  ]

  // Reset form when client changes or modal opens
  useEffect(() => {
    if (client) {
      setFormData({
        companyName: client.companyName || "",
        contactName: client.contactName || "",
        email: client.email || "",
        phone: client.phone || "",
        industry: client.industry || "",
        notes: client.notes || "",
        status: client.status === "active" || client.status === "vip",
        clientType: client.clientType || "company",
        tags: client.tags || [],
        address: {
          street: client.address?.street || "",
          city: client.address?.city || "",
          postalCode: client.address?.postalCode || "",
          county: client.address?.county || "",
          country: client.address?.country || "United Kingdom",
        },
      })
    } else {
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        industry: "",
        notes: "",
        status: true,
        clientType: "company",
        tags: [],
        address: {
          street: "",
          city: "",
          postalCode: "",
          county: "",
          country: "United Kingdom",
        },
      })
    }
    // Clear any previous errors
    setErrors({})
    setSelectedTag("")
  }, [client, isOpen])

  // Handle form field changes
  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => {
      // Handle nested address fields
      if (field.startsWith("address.")) {
        const addressField = field.split(".")[1]
        return {
          ...prev,
          address: {
            ...prev.address,
            [addressField]: value,
          },
        }
      }
      // Handle regular fields
      return {
        ...prev,
        [field]: value,
      }
    })

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Add tag to client
  const handleAddTag = () => {
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      handleChange("tags", [...formData.tags, selectedTag])
      setSelectedTag("")
    }
  }

  // Remove tag from client
  const handleRemoveTag = (tagToRemove: string) => {
    handleChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company/Client name is required"
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Phone validation (optional field)
    if (formData.phone && !/^[0-9+\-\s()]*$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    // Postal code validation (optional field)
    if (formData.address.postalCode && !/^[A-Z0-9\s-]*$/i.test(formData.address.postalCode)) {
      newErrors["address.postalCode"] = "Please enter a valid postal code"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      })
      return
    }

    // Show loading state
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const clientData = {
        ...formData,
        status: formData.status ? "active" : "inactive",
      }

      // Call the onSave callback
      onSave?.(clientData)

      // Show success toast
      toast({
        title: client ? "Client Updated" : "Client Added",
        description: `${formData.companyName} has been ${client ? "updated" : "added"} successfully.`,
      })

      // Reset loading state
      setIsSubmitting(false)

      // Close the modal
      onClose()
    }, 1000)
  }

  // Get tag badge class
  const getTagBadgeClass = (tag: string) => {
    switch (tag) {
      case "vip":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "follow-up":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "late-payer":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      case "new":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "potential":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="flex items-center justify-between">
                  <span>
                    Company/Client Name <span className="text-destructive">*</span>
                  </span>
                  {errors.companyName && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.companyName}
                    </span>
                  )}
                </Label>
                <Input
                  id="company-name"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className={`rounded-xl ${errors.companyName ? "border-destructive" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-name" className="flex items-center justify-between">
                  <span>
                    Contact Name <span className="text-destructive">*</span>
                  </span>
                  {errors.contactName && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.contactName}
                    </span>
                  )}
                </Label>
                <Input
                  id="contact-name"
                  value={formData.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                  className={`rounded-xl ${errors.contactName ? "border-destructive" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center justify-between">
                  <span>
                    Email <span className="text-destructive">*</span>
                  </span>
                  {errors.email && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.email}
                    </span>
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`rounded-xl ${errors.email ? "border-destructive" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center justify-between">
                  <span>Phone</span>
                  {errors.phone && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.phone}
                    </span>
                  )}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`rounded-xl ${errors.phone ? "border-destructive" : ""}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleChange("industry", value)}>
                  <SelectTrigger id="industry" className="rounded-xl">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Industrial">Industrial</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-type">Client Type</Label>
                <Select value={formData.clientType} onValueChange={(value) => handleChange("clientType", value)}>
                  <SelectTrigger id="client-type" className="rounded-xl">
                    <SelectValue placeholder="Select client type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company (Commercial)</SelectItem>
                    <SelectItem value="individual">Individual (Residential)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center justify-between rounded-xl border border-input p-3 h-10">
                  <span className="text-sm">Active</span>
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={(checked) => handleChange("status", checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <h3 className="text-sm font-medium text-muted-foreground pt-2">Tags</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="rounded-xl flex-1">
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTags.map((tag) => (
                      <SelectItem key={tag.value} value={tag.value}>
                        {tag.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleAddTag}
                  disabled={!selectedTag}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className={`rounded-xl ${getTagBadgeClass(tag)}`}>
                      {tag
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                      <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4 pt-2 border-t border-border/40">
            <h3 className="text-sm font-medium text-muted-foreground pt-2">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="street-address">Street Address</Label>
                <Input
                  id="street-address"
                  value={formData.address.street}
                  onChange={(e) => handleChange("address.street", e.target.value)}
                  className="rounded-xl"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City/Town</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleChange("address.city", e.target.value)}
                  className="rounded-xl"
                  placeholder="London"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal-code" className="flex items-center justify-between">
                  <span>Postal Code</span>
                  {errors["address.postalCode"] && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors["address.postalCode"]}
                    </span>
                  )}
                </Label>
                <Input
                  id="postal-code"
                  value={formData.address.postalCode}
                  onChange={(e) => handleChange("address.postalCode", e.target.value)}
                  className={`rounded-xl ${errors["address.postalCode"] ? "border-destructive" : ""}`}
                  placeholder="SW1A 1AA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  value={formData.address.county}
                  onChange={(e) => handleChange("address.county", e.target.value)}
                  className="rounded-xl"
                  placeholder="Greater London"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => handleChange("address.country", e.target.value)}
                  className="rounded-xl"
                  placeholder="United Kingdom"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <Label htmlFor="notes" className="pt-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="min-h-[100px] rounded-xl"
              placeholder="Add any additional notes about this client..."
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {client ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{client ? "Update Client" : "Add Client"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
