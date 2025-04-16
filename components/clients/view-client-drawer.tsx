"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building,
  Mail,
  Phone,
  Briefcase,
  FileText,
  FileCheck,
  File,
  Send,
  ExternalLink,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Clock,
  MessageCircle,
  PlusCircle,
  Bell,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ViewClientDrawerProps {
  isOpen: boolean
  onClose: () => void
  client: any
}

export function ViewClientDrawer({ isOpen, onClose, client }: ViewClientDrawerProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [adminNote, setAdminNote] = useState("")
  const [interactionType, setInteractionType] = useState("email")
  const [interactionNote, setInteractionNote] = useState("")
  const { toast } = useToast()
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false)
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [isAddingInteraction, setIsAddingInteraction] = useState(false)
  const [isSettingReminder, setIsSettingReminder] = useState(false)
  const [reminderDays, setReminderDays] = useState("7")

  if (!client) return null

  const handleGeneratePortalInvite = () => {
    setIsGeneratingInvite(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Portal Invite Generated",
        description: `An invitation has been sent to ${client.email}`,
        variant: "default",
      })
      setIsGeneratingInvite(false)
    }, 1000)
  }

  const handleSaveNote = () => {
    if (adminNote.trim()) {
      setIsSavingNote(true)

      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Note Saved",
          description: "Your note has been saved successfully",
          variant: "default",
        })
        setIsSavingNote(false)
        setAdminNote("")
      }, 1000)
    } else {
      toast({
        title: "Error",
        description: "Please enter a note before saving",
        variant: "destructive",
      })
    }
  }

  const handleAddInteraction = () => {
    if (interactionNote.trim()) {
      setIsAddingInteraction(true)

      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Interaction Added",
          description: "Your interaction has been recorded successfully",
          variant: "default",
        })
        setIsAddingInteraction(false)
        setInteractionNote("")
      }, 1000)
    } else {
      toast({
        title: "Error",
        description: "Please enter interaction details before saving",
        variant: "destructive",
      })
    }
  }

  const handleSetReminder = () => {
    setIsSettingReminder(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Reminder Set",
        description: `You will be reminded to follow up with ${client.companyName} in ${reminderDays} days`,
        variant: "default",
      })
      setIsSettingReminder(false)
    }, 1000)
  }

  // Format address for display
  const formatAddress = () => {
    if (!client.address) return "No address provided"

    const parts = [
      client.address.street,
      client.address.city,
      client.address.postalCode,
      client.address.county,
      client.address.country,
    ].filter(Boolean)

    return parts.join(", ")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  // Check if address exists
  const hasAddress =
    client.address &&
    (client.address.street ||
      client.address.city ||
      client.address.postalCode ||
      client.address.county ||
      client.address.country)

  // Get interaction icon
  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4 text-blue-500" />
      case "call":
        return <Phone className="h-4 w-4 text-green-500" />
      case "meeting":
        return <Users className="h-4 w-4 text-purple-500" />
      default:
        return <MessageCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Get tag badges
  const getTagBadges = (tags: string[]) => {
    if (!tags || tags.length === 0) return <span className="text-muted-foreground">No tags</span>

    return (
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => {
          let badgeClass = ""

          if (tag === "vip") {
            badgeClass = "bg-amber-500/10 text-amber-500 border-amber-500/20"
          } else if (tag === "follow-up") {
            badgeClass = "bg-blue-500/10 text-blue-500 border-blue-500/20"
          } else if (tag === "late-payer") {
            badgeClass = "bg-rose-500/10 text-rose-500 border-rose-500/20"
          } else if (tag === "new") {
            badgeClass = "bg-green-500/10 text-green-500 border-green-500/20"
          } else if (tag === "potential") {
            badgeClass = "bg-purple-500/10 text-purple-500 border-purple-500/20"
          }

          return (
            <Badge key={tag} variant="outline" className={`rounded-xl ${badgeClass}`}>
              {tag
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
          )
        })}
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-[600px] p-0 rounded-l-2xl overflow-y-auto">
        <SheetHeader className="p-6 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <SheetTitle className="text-2xl">{client.companyName}</SheetTitle>
              <p className="text-muted-foreground mt-1">{client.contactName}</p>
            </div>
            <Badge
              variant="outline"
              className={`rounded-xl ${
                client.status === "active"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : client.status === "vip"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              }`}
            >
              {client.status === "vip" ? "VIP" : client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </Badge>
          </div>
          <div className="mt-2">{getTagBadges(client.tags || [])}</div>
        </SheetHeader>

        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid grid-cols-5 w-full rounded-xl">
              <TabsTrigger value="info" className="rounded-xl">
                Info
              </TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-xl">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl">
                Projects
              </TabsTrigger>
              <TabsTrigger value="invoices" className="rounded-xl">
                Invoices
              </TabsTrigger>
              <TabsTrigger value="documents" className="rounded-xl">
                Documents
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Info Tab */}
          <TabsContent value="info" className="p-6 pt-4 space-y-6">
            <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Industry</div>
                    <div>{client.industry}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div>{client.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Phone</div>
                    <div>{client.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Projects</div>
                    <div>
                      {client.projectCount} {client.projectCount === 1 ? "Project" : "Projects"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                    <div>{client.totalValue || "£0"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Client Type</div>
                    <div>{client.clientType === "company" ? "Company (Commercial)" : "Individual (Residential)"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Last Contacted</div>
                    <div>{formatDate(client.lastContacted)}</div>
                  </div>
                </div>
                {hasAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Address</div>
                      <div className="whitespace-pre-line">
                        {client.address?.street && <div>{client.address.street}</div>}
                        {client.address?.city && client.address?.postalCode && (
                          <div>
                            {client.address.city}, {client.address.postalCode}
                          </div>
                        )}
                        {client.address?.county && <div>{client.address.county}</div>}
                        {client.address?.country && <div>{client.address.country}</div>}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notes</CardTitle>
                <CardDescription>Internal notes about this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.notes && (
                  <div className="p-3 bg-muted/50 rounded-xl">
                    <p>{client.notes}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Textarea
                    placeholder="Add a note about this client..."
                    className="min-h-[100px] rounded-xl"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                  <Button className="rounded-xl w-full" onClick={handleSaveNote} disabled={isSavingNote}>
                    {isSavingNote ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Save Note
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Follow-up Reminder Section */}
            <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Follow-up Reminder</CardTitle>
                <CardDescription>Set a reminder to follow up with this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Select value={reminderDays} onValueChange={setReminderDays}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tomorrow</SelectItem>
                      <SelectItem value="3">In 3 days</SelectItem>
                      <SelectItem value="7">In 1 week</SelectItem>
                      <SelectItem value="14">In 2 weeks</SelectItem>
                      <SelectItem value="30">In 1 month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="rounded-xl flex-1" onClick={handleSetReminder} disabled={isSettingReminder}>
                    {isSettingReminder ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Setting...
                      </>
                    ) : (
                      <>
                        <Bell className="mr-2 h-4 w-4" />
                        Set Reminder
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Client Portal Section */}
            <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Client Portal</CardTitle>
                <CardDescription>
                  {client.status === "active" || client.status === "vip"
                    ? "Give this client access to their projects, invoices, and documents"
                    : "Activate this client to enable portal access"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="rounded-xl w-full"
                  disabled={client.status === "inactive" || isGeneratingInvite}
                  onClick={handleGeneratePortalInvite}
                >
                  {isGeneratingInvite ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Generate Portal Invite
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="p-6 pt-4 space-y-6">
            <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Add Interaction</CardTitle>
                <CardDescription>Record a new interaction with this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Select value={interactionType} onValueChange={setInteractionType}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Interaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="call">Phone Call</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Describe the interaction..."
                        className="min-h-[100px] rounded-xl"
                        value={interactionNote}
                        onChange={(e) => setInteractionNote(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button className="rounded-xl w-full" onClick={handleAddInteraction} disabled={isAddingInteraction}>
                    {isAddingInteraction ? (
                      <>
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Adding...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Interaction
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Interaction History</CardTitle>
                <CardDescription>Recent interactions with this client</CardDescription>
              </CardHeader>
              <CardContent>
                {client.interactions && client.interactions.length > 0 ? (
                  <div className="space-y-4">
                    {client.interactions.map((interaction: any) => (
                      <div key={interaction.id} className="flex gap-4">
                        <div className="mt-0.5">{getInteractionIcon(interaction.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">{formatDate(interaction.date)}</p>
                          </div>
                          <p className="text-sm">{interaction.description}</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-xs">
                                {interaction.user
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-xs text-muted-foreground">{interaction.user}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No interactions recorded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="p-6 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Projects ({client.projects?.length || 0})</h3>
              <Button
                variant="outline"
                className="rounded-xl"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Creating New Project",
                    description: `Starting new project for ${client.companyName}`,
                  })
                }}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>

            {client.projects?.length > 0 ? (
              <div className="space-y-3">
                {client.projects.map((project: any) => (
                  <Card key={project.id} className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{project.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{project.value}</span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`rounded-xl ${
                            project.status === "Completed"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : project.status === "In Progress"
                                ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No projects yet</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => {
                    toast({
                      title: "Creating First Project",
                      description: `Starting first project for ${client.companyName}`,
                    })
                  }}
                >
                  Create First Project
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="p-6 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Invoices ({client.invoices?.length || 0})</h3>
              <Button
                variant="outline"
                className="rounded-xl"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Creating New Invoice",
                    description: `Starting new invoice for ${client.companyName}`,
                  })
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>

            {client.invoices?.length > 0 ? (
              <div className="space-y-3">
                {client.invoices.map((invoice: any) => (
                  <Card key={invoice.id} className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{invoice.number}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{formatDate(invoice.date)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{invoice.amount}</div>
                          <Badge
                            variant="outline"
                            className={`rounded-xl mt-1 ${
                              invoice.status === "Paid"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : invoice.status === "Pending"
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No invoices yet</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => {
                    toast({
                      title: "Creating First Invoice",
                      description: `Starting first invoice for ${client.companyName}`,
                    })
                  }}
                >
                  Create First Invoice
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="p-6 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Documents ({client.documents?.length || 0})</h3>
              <Button
                variant="outline"
                className="rounded-xl"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Upload Document",
                    description: `Preparing to upload document for ${client.companyName}`,
                  })
                }}
              >
                <File className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>

            {client.documents?.length > 0 ? (
              <div className="space-y-3">
                {client.documents.map((document: any) => (
                  <Card key={document.id} className="rounded-xl border-border/40 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {document.type === "Contract" ? (
                              <FileCheck className="h-5 w-5 text-blue-500" />
                            ) : document.type === "Plans" || document.type === "Designs" ? (
                              <File className="h-5 w-5 text-purple-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-teal-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{document.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="rounded-xl text-xs">
                                {document.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatDate(document.date)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => {
                            toast({
                              title: "Opening Document",
                              description: `Opening ${document.name}`,
                            })
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <File className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No documents yet</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => {
                    toast({
                      title: "Upload First Document",
                      description: `Preparing to upload first document for ${client.companyName}`,
                    })
                  }}
                >
                  Upload First Document
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
