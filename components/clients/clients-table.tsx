"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Building, Mail, Phone, Briefcase, Users, Clock, DollarSign, Bell } from "lucide-react"
import { AddEditClientModal } from "./add-edit-client-modal"
import { DeleteClientDialog } from "./delete-client-dialog"
import { ViewClientDrawer } from "./view-client-drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for clients with enhanced CRM fields
const initialClientsData = [
  {
    id: "client-1",
    companyName: "Oakwood Properties",
    contactName: "John Smith",
    email: "john@oakwood.com",
    phone: "+44 7123 456789",
    industry: "Residential",
    projectCount: 5,
    totalValue: "£285,000",
    status: "active",
    clientType: "company",
    lastContacted: "2023-07-15",
    lastContactType: "email",
    tags: ["vip", "potential"],
    address: {
      street: "123 Business Park Way",
      city: "Manchester",
      postalCode: "M1 2AB",
      county: "Greater Manchester",
      country: "United Kingdom",
    },
    notes: "Long-term client, prefers email communication.",
    projects: [
      { id: "proj-1", name: "Oakwood Residence", status: "Completed", value: "£120,000" },
      { id: "proj-2", name: "Smith Family Home", status: "In Progress", value: "£85,000" },
      { id: "proj-3", name: "Riverside Apartments", status: "Planning", value: "£250,000" },
      { id: "proj-4", name: "Oakwood Office Renovation", status: "Completed", value: "£45,000" },
      { id: "proj-5", name: "Garden Terrace Extension", status: "In Progress", value: "£35,000" },
    ],
    invoices: [
      { id: "inv-1", number: "INV-2023-001", amount: "£25,000", status: "Paid", date: "2023-01-15" },
      { id: "inv-2", number: "INV-2023-015", amount: "£35,000", status: "Pending", date: "2023-03-22" },
      { id: "inv-3", number: "INV-2023-028", amount: "£15,000", status: "Overdue", date: "2023-05-10" },
    ],
    documents: [
      { id: "doc-1", name: "Contract - Oakwood Residence.pdf", type: "Contract", date: "2022-11-05" },
      { id: "doc-2", name: "Riverside Apartments Plans.pdf", type: "Plans", date: "2023-02-18" },
      { id: "doc-3", name: "Smith Family Home Specifications.docx", type: "Specifications", date: "2023-01-30" },
    ],
    interactions: [
      {
        id: "int-1",
        type: "email",
        date: "2023-07-15",
        description: "Sent project update for Smith Family Home",
        user: "Alex Turner",
      },
      {
        id: "int-2",
        type: "call",
        date: "2023-07-10",
        description: "Discussed timeline for Riverside Apartments",
        user: "Sarah Johnson",
      },
      {
        id: "int-3",
        type: "meeting",
        date: "2023-06-28",
        description: "On-site visit to Garden Terrace Extension",
        user: "Alex Turner",
      },
    ],
  },
  {
    id: "client-2",
    companyName: "Metro Commercial Ltd",
    contactName: "Sarah Johnson",
    email: "sarah@metrocommercial.com",
    phone: "+44 7234 567890",
    industry: "Commercial",
    projectCount: 2,
    totalValue: "£470,000",
    status: "active",
    lastContacted: "2023-07-18",
    lastContactType: "meeting",
    tags: ["new"],
    notes: "New client, referred by Oakwood Properties.",
    clientType: "company",
    address: {
      street: "45 City Centre Plaza",
      city: "Birmingham",
      postalCode: "B2 5DP",
      county: "West Midlands",
      country: "United Kingdom",
    },
    projects: [
      { id: "proj-6", name: "Metro Office Building", status: "In Progress", value: "£350,000" },
      { id: "proj-7", name: "Retail Space Renovation", status: "Planning", value: "£120,000" },
    ],
    invoices: [{ id: "inv-4", number: "INV-2023-032", amount: "£75,000", status: "Paid", date: "2023-06-05" }],
    documents: [
      { id: "doc-4", name: "Metro Office Building Contract.pdf", type: "Contract", date: "2023-05-12" },
      { id: "doc-5", name: "Retail Space Initial Designs.pdf", type: "Designs", date: "2023-06-20" },
    ],
    interactions: [
      {
        id: "int-4",
        type: "meeting",
        date: "2023-07-18",
        description: "Initial consultation for Retail Space Renovation",
        user: "Michael Brown",
      },
      {
        id: "int-5",
        type: "email",
        date: "2023-07-05",
        description: "Sent contract for Metro Office Building",
        user: "Alex Turner",
      },
    ],
  },
  {
    id: "client-3",
    companyName: "Greenfield Developments",
    contactName: "Michael Brown",
    email: "michael@greenfield.com",
    phone: "+44 7345 678901",
    industry: "Residential",
    projectCount: 3,
    totalValue: "£470,000",
    status: "vip",
    lastContacted: "2023-07-20",
    lastContactType: "call",
    tags: ["vip", "potential"],
    notes: "Eco-friendly focus, interested in sustainable building practices.",
    clientType: "company",
    address: {
      street: "78 Green Avenue",
      city: "Bristol",
      postalCode: "BS1 6TH",
      county: "Bristol",
      country: "United Kingdom",
    },
    projects: [
      { id: "proj-8", name: "Greenfield Eco Homes", status: "In Progress", value: "£420,000" },
      { id: "proj-9", name: "Solar Panel Installation", status: "Completed", value: "£35,000" },
      { id: "proj-10", name: "Community Garden Project", status: "Planning", value: "£15,000" },
    ],
    invoices: [
      { id: "inv-5", number: "INV-2023-018", amount: "£120,000", status: "Paid", date: "2023-04-10" },
      { id: "inv-6", number: "INV-2023-025", amount: "£35,000", status: "Paid", date: "2023-05-22" },
    ],
    documents: [
      { id: "doc-6", name: "Eco Homes Specifications.pdf", type: "Specifications", date: "2023-03-15" },
      { id: "doc-7", name: "Solar Panel Installation Agreement.pdf", type: "Contract", date: "2023-02-28" },
    ],
    interactions: [
      {
        id: "int-6",
        type: "call",
        date: "2023-07-20",
        description: "Discussed progress on Eco Homes project",
        user: "Sarah Johnson",
      },
      {
        id: "int-7",
        type: "email",
        date: "2023-07-12",
        description: "Sent proposal for Community Garden Project",
        user: "Alex Turner",
      },
    ],
  },
  {
    id: "client-4",
    companyName: "City Hospital Trust",
    contactName: "Emma Wilson",
    email: "emma.wilson@cityhospital.org",
    phone: "+44 7456 789012",
    industry: "Healthcare",
    projectCount: 1,
    totalValue: "£780,000",
    status: "active",
    lastContacted: "2023-07-05",
    lastContactType: "email",
    tags: [],
    notes: "Strict compliance requirements, needs detailed documentation.",
    clientType: "company",
    address: {
      street: "100 Hospital Road",
      city: "Leeds",
      postalCode: "LS1 3EX",
      county: "West Yorkshire",
      country: "United Kingdom",
    },
    projects: [{ id: "proj-11", name: "Hospital Wing Renovation", status: "In Progress", value: "£780,000" }],
    invoices: [{ id: "inv-7", number: "INV-2023-030", amount: "£250,000", status: "Paid", date: "2023-06-01" }],
    documents: [
      { id: "doc-8", name: "Hospital Wing Contract.pdf", type: "Contract", date: "2023-05-05" },
      { id: "doc-9", name: "Medical Facility Requirements.pdf", type: "Requirements", date: "2023-05-10" },
    ],
    interactions: [
      {
        id: "int-8",
        type: "email",
        date: "2023-07-05",
        description: "Sent progress report on Hospital Wing Renovation",
        user: "Michael Brown",
      },
    ],
  },
  {
    id: "client-5",
    companyName: "Sunset Homes",
    contactName: "David Clark",
    email: "david@sunsethomes.com",
    phone: "+44 7567 890123",
    industry: "Residential",
    projectCount: 0,
    totalValue: "£0",
    status: "inactive",
    lastContacted: "2023-03-15",
    lastContactType: "call",
    tags: ["follow-up"],
    notes: "Previous client, currently no active projects.",
    clientType: "company",
    address: {
      street: "22 Sunset Boulevard",
      city: "Brighton",
      postalCode: "BN1 4GH",
      county: "East Sussex",
      country: "United Kingdom",
    },
    projects: [],
    invoices: [],
    documents: [{ id: "doc-10", name: "Previous Project Archive.zip", type: "Archive", date: "2022-12-15" }],
    interactions: [
      {
        id: "int-9",
        type: "call",
        date: "2023-03-15",
        description: "Discussed potential new projects",
        user: "Sarah Johnson",
      },
    ],
  },
  {
    id: "client-6",
    companyName: "Northside School District",
    contactName: "Jennifer Adams",
    email: "jennifer.adams@northside.edu",
    phone: "+44 7678 901234",
    industry: "Education",
    projectCount: 2,
    totalValue: "£415,000",
    status: "active",
    lastContacted: "2023-07-12",
    lastContactType: "meeting",
    tags: [],
    notes: "School projects need to be scheduled around academic calendar.",
    clientType: "company",
    address: {
      street: "55 Education Lane",
      city: "Sheffield",
      postalCode: "S1 2BB",
      county: "South Yorkshire",
      country: "United Kingdom",
    },
    projects: [
      { id: "proj-12", name: "Science Building Renovation", status: "Planning", value: "£320,000" },
      { id: "proj-13", name: "Sports Field Upgrade", status: "In Progress", value: "£95,000" },
    ],
    invoices: [{ id: "inv-8", number: "INV-2023-035", amount: "£45,000", status: "Pending", date: "2023-06-15" }],
    documents: [
      { id: "doc-11", name: "Science Building Plans.pdf", type: "Plans", date: "2023-05-25" },
      { id: "doc-12", name: "Sports Field Specifications.pdf", type: "Specifications", date: "2023-04-30" },
    ],
    interactions: [
      {
        id: "int-10",
        type: "meeting",
        date: "2023-07-12",
        description: "On-site inspection of Sports Field progress",
        user: "Michael Brown",
      },
      {
        id: "int-11",
        type: "email",
        date: "2023-06-30",
        description: "Sent updated timeline for Science Building Renovation",
        user: "Alex Turner",
      },
    ],
  },
  {
    id: "client-7",
    companyName: "TechHub Innovations",
    contactName: "Robert Chen",
    email: "robert@techhub.com",
    phone: "+44 7789 012345",
    industry: "Commercial",
    projectCount: 1,
    totalValue: "£180,000",
    status: "active",
    lastContacted: "2023-07-19",
    lastContactType: "email",
    tags: ["new", "potential"],
    notes: "Tech startup, modern design preferences.",
    clientType: "company",
    address: {
      street: "Unit 7, Innovation Park",
      city: "Cambridge",
      postalCode: "CB2 1NT",
      county: "Cambridgeshire",
      country: "United Kingdom",
    },
    projects: [{ id: "proj-14", name: "TechHub Office Space", status: "In Progress", value: "£180,000" }],
    invoices: [{ id: "inv-9", number: "INV-2023-038", amount: "£60,000", status: "Paid", date: "2023-06-20" }],
    documents: [
      { id: "doc-13", name: "Office Space Design.pdf", type: "Designs", date: "2023-05-15" },
      { id: "doc-14", name: "TechHub Contract.pdf", type: "Contract", date: "2023-06-01" },
    ],
    interactions: [
      {
        id: "int-12",
        type: "email",
        date: "2023-07-19",
        description: "Sent progress photos of office construction",
        user: "Sarah Johnson",
      },
      {
        id: "int-13",
        type: "call",
        date: "2023-07-10",
        description: "Discussed furniture options and timeline",
        user: "Michael Brown",
      },
    ],
  },
  {
    id: "client-8",
    companyName: "Thompson Residence",
    contactName: "Mark Thompson",
    email: "mark.thompson@gmail.com",
    phone: "+44 7890 123456",
    industry: "Residential",
    projectCount: 1,
    totalValue: "£25,000",
    status: "active",
    lastContacted: "2023-07-17",
    lastContactType: "call",
    tags: ["follow-up"],
    clientType: "individual",
    address: {
      street: "42 Oak Lane",
      city: "Oxford",
      postalCode: "OX1 2JD",
      county: "Oxfordshire",
      country: "United Kingdom",
    },
    notes: "First-time homeowner, looking for kitchen renovation.",
    projects: [{ id: "proj-15", name: "Kitchen Renovation", status: "In Progress", value: "£25,000" }],
    invoices: [{ id: "inv-10", number: "INV-2023-040", amount: "£12,500", status: "Paid", date: "2023-06-25" }],
    documents: [
      { id: "doc-15", name: "Kitchen Design Plans.pdf", type: "Plans", date: "2023-06-10" },
      { id: "doc-16", name: "Thompson Contract.pdf", type: "Contract", date: "2023-06-15" },
    ],
    interactions: [
      {
        id: "int-14",
        type: "call",
        date: "2023-07-17",
        description: "Discussed cabinet selection and timeline",
        user: "Alex Turner",
      },
      {
        id: "int-15",
        type: "email",
        date: "2023-07-05",
        description: "Sent updated kitchen design renderings",
        user: "Sarah Johnson",
      },
    ],
  },
  {
    id: "client-9",
    companyName: "Wilson Family Home",
    contactName: "Jessica Wilson",
    email: "jessica.wilson@outlook.com",
    phone: "+44 7901 234567",
    industry: "Residential",
    projectCount: 2,
    totalValue: "£26,500",
    status: "active",
    lastContacted: "2023-07-14",
    lastContactType: "meeting",
    tags: ["late-payer"],
    clientType: "individual",
    address: {
      street: "15 Maple Street",
      city: "Edinburgh",
      postalCode: "EH1 1TH",
      county: "Edinburgh",
      country: "United Kingdom",
    },
    notes: "Prefers weekend appointments, has two ongoing projects.",
    projects: [
      { id: "proj-16", name: "Bathroom Remodel", status: "In Progress", value: "£18,000" },
      { id: "proj-17", name: "Garden Landscaping", status: "Planning", value: "£8,500" },
    ],
    invoices: [
      { id: "inv-11", number: "INV-2023-042", amount: "£9,000", status: "Paid", date: "2023-06-28" },
      { id: "inv-12", number: "INV-2023-045", amount: "£4,500", status: "Overdue", date: "2023-07-05" },
    ],
    documents: [
      { id: "doc-17", name: "Bathroom Design.pdf", type: "Designs", date: "2023-06-15" },
      { id: "doc-18", name: "Garden Layout.pdf", type: "Plans", date: "2023-06-20" },
    ],
    interactions: [
      {
        id: "int-16",
        type: "meeting",
        date: "2023-07-14",
        description: "On-site visit to review bathroom progress",
        user: "Michael Brown",
      },
      {
        id: "int-17",
        type: "call",
        date: "2023-07-10",
        description: "Payment reminder for overdue invoice",
        user: "Sarah Johnson",
      },
    ],
  },
]

export function ClientsTable() {
  const [clientsData, setClientsData] = useState(initialClientsData)
  const [editingClient, setEditingClient] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [deletingClient, setDeletingClient] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [viewingClient, setViewingClient] = useState<any>(null)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)

  const isMobile = useIsMobile()
  const { toast } = useToast()

  // Handle view client
  const handleViewClient = (client: any) => {
    setViewingClient(client)
    setIsViewDrawerOpen(true)
  }

  // Handle edit client
  const handleEditClient = (client: any) => {
    setEditingClient(client)
    setIsEditModalOpen(true)
  }

  // Handle delete client
  const handleDeleteClient = (client: any) => {
    setDeletingClient(client)
    setIsDeleteDialogOpen(true)
  }

  // Handle save client (update)
  const handleSaveClient = (updatedClient: any) => {
    if (editingClient) {
      // Update existing client
      setClientsData(
        clientsData.map((client) => (client.id === editingClient.id ? { ...client, ...updatedClient } : client)),
      )

      toast({
        title: "Client Updated",
        description: `${updatedClient.companyName} has been updated successfully.`,
      })
    } else {
      // Add new client
      const newClient = {
        id: `client-${Date.now()}`,
        ...updatedClient,
        projectCount: 0,
        totalValue: "£0",
        lastContacted: new Date().toISOString().split("T")[0],
        lastContactType: "email",
        projects: [],
        invoices: [],
        documents: [],
        interactions: [
          {
            id: `int-${Date.now()}`,
            type: "email",
            date: new Date().toISOString().split("T")[0],
            description: "Initial client setup",
            user: "Current User",
          },
        ],
      }
      setClientsData([...clientsData, newClient])

      toast({
        title: "Client Added",
        description: `${updatedClient.companyName} has been added successfully.`,
      })
    }

    setIsEditModalOpen(false)
    setEditingClient(null)
  }

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deletingClient) {
      setClientsData(clientsData.filter((client) => client.id !== deletingClient.id))
      setIsDeleteDialogOpen(false)
      setDeletingClient(null)
    }
  }

  // Format address for display in table
  const formatAddressShort = (address: any) => {
    if (!address) return "—"
    return `${address.city}, ${address.postalCode}`
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

  // Calculate days since last contact
  const getDaysSinceContact = (dateString: string) => {
    if (!dateString) return null
    const contactDate = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - contactDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get last contact badge
  const getLastContactBadge = (client: any) => {
    const days = getDaysSinceContact(client.lastContacted)
    if (!days) return null

    let badgeClass = ""
    let icon = null
    let text = ""

    if (client.lastContactType === "email") {
      icon = <Mail className="h-3 w-3 mr-1" />
      text = "Emailed"
    } else if (client.lastContactType === "call") {
      icon = <Phone className="h-3 w-3 mr-1" />
      text = "Called"
    } else if (client.lastContactType === "meeting") {
      icon = <Users className="h-3 w-3 mr-1" />
      text = "Met"
    }

    if (days === 0) {
      badgeClass = "bg-green-500/10 text-green-500 border-green-500/20"
      text += " today"
    } else if (days === 1) {
      badgeClass = "bg-green-500/10 text-green-500 border-green-500/20"
      text += " yesterday"
    } else if (days <= 7) {
      badgeClass = "bg-blue-500/10 text-blue-500 border-blue-500/20"
      text += ` ${days} days ago`
    } else if (days <= 30) {
      badgeClass = "bg-amber-500/10 text-amber-500 border-amber-500/20"
      text += ` ${days} days ago`
    } else {
      badgeClass = "bg-rose-500/10 text-rose-500 border-rose-500/20"
      text += ` ${days} days ago`
    }

    return (
      <Badge variant="outline" className={`rounded-xl ${badgeClass} flex items-center`}>
        {icon}
        {text}
      </Badge>
    )
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    let badgeClass = ""

    if (status === "active") {
      badgeClass = "bg-green-500/10 text-green-500 border-green-500/20"
    } else if (status === "vip") {
      badgeClass = "bg-amber-500/10 text-amber-500 border-amber-500/20"
    } else {
      badgeClass = "bg-rose-500/10 text-rose-500 border-rose-500/20"
    }

    return (
      <Badge variant="outline" className={`rounded-xl ${badgeClass}`}>
        {status === "vip" ? "VIP" : status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Get tag badges
  const getTagBadges = (tags: string[]) => {
    if (!tags || tags.length === 0) return null

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
            <Badge key={tag} variant="outline" className={`rounded-xl ${badgeClass} text-xs`}>
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

  // Set reminder
  const handleSetReminder = (client: any) => {
    toast({
      title: "Reminder Set",
      description: `You will be reminded to follow up with ${client.companyName} in 7 days.`,
    })
  }

  // Render desktop table view
  const renderTableView = () => (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Company/Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Last Contacted</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientsData.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.companyName}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{client.contactName}</span>
                  <span className="text-xs text-muted-foreground">{client.email}</span>
                </div>
              </TableCell>
              <TableCell>{getLastContactBadge(client)}</TableCell>
              <TableCell>{client.projectCount}</TableCell>
              <TableCell>{client.totalValue}</TableCell>
              <TableCell>{getStatusBadge(client.status)}</TableCell>
              <TableCell>{getTagBadges(client.tags)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl"
                          onClick={() => handleSetReminder(client)}
                        >
                          <Bell className="h-4 w-4" />
                          <span className="sr-only">Set Reminder</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Set Follow-up Reminder</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleViewClient(client)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClient(client)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Render mobile card view
  const renderCardView = () => (
    <div className="space-y-4">
      {clientsData.map((client) => (
        <Card key={client.id} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{client.companyName}</CardTitle>
              {getStatusBadge(client.status)}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">{getTagBadges(client.tags)}</div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{client.contactName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{client.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{client.projectCount} Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{client.totalValue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{getLastContactBadge(client)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between">
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleSetReminder(client)}>
              <Bell className="h-4 w-4 mr-1" />
              Remind
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleViewClient(client)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleEditClient(client)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDeleteClient(client)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <>
      {isMobile ? renderCardView() : renderTableView()}

      {/* View Client Drawer */}
      <ViewClientDrawer
        isOpen={isViewDrawerOpen}
        onClose={() => {
          setIsViewDrawerOpen(false)
          setViewingClient(null)
        }}
        client={viewingClient}
      />

      {/* Edit Client Modal */}
      <AddEditClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingClient(null)
        }}
        client={editingClient}
        onSave={handleSaveClient}
      />

      {/* Delete Client Dialog */}
      <DeleteClientDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setDeletingClient(null)
        }}
        onConfirm={handleConfirmDelete}
        client={deletingClient}
      />
    </>
  )
}
