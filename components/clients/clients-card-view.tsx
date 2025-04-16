"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Building, Mail, Phone, Briefcase, Users, Clock, DollarSign, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClientsCardViewProps {
  clients: any[]
  onView: (client: any) => void
  onEdit: (client: any) => void
  onDelete: (client: any) => void
}

export function ClientsCardView({ clients, onView, onEdit, onDelete }: ClientsCardViewProps) {
  const { toast } = useToast()

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

  return (
    <div className="space-y-4">
      {clients.map((client) => (
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
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => onView(client)}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => onEdit(client)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(client)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
