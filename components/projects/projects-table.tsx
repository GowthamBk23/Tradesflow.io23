"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, Folder, Receipt, Archive, CheckSquare, Edit } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ProjectsTableProps {
  projects: any[]
  onEdit: (project: any) => void
  onUpdateStatus: (projectId: string, newStatus: string) => void
  filters?: {
    status: string
    client: string
    location: string
    search: string
  }
}

export function ProjectsTable({
  projects,
  onEdit,
  onUpdateStatus,
  filters = { status: "all", client: "all", location: "all", search: "" },
}: ProjectsTableProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Ongoing</Badge>
      case "complete":
        return <Badge className="bg-green-500 hover:bg-green-600">Complete</Badge>
      case "on-hold":
        return <Badge className="bg-amber-500 hover:bg-amber-600">On Hold</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Handle view tasks
  const handleViewTasks = (project: any) => {
    toast({
      title: "Viewing Tasks",
      description: `Navigating to tasks for ${project.name}`,
    })
  }

  // Handle view documents
  const handleViewDocuments = (project: any) => {
    toast({
      title: "Viewing Documents",
      description: `Navigating to documents for ${project.name}`,
    })
  }

  // Handle view invoices
  const handleViewInvoices = (project: any) => {
    toast({
      title: "Viewing Invoices",
      description: `Navigating to invoices for ${project.name}`,
    })
  }

  // Handle archive project with loading state
  const handleArchive = async (projectId: string) => {
    setLoading(projectId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onUpdateStatus(projectId, "on-hold")
    setLoading(null)
  }

  // Handle mark as complete with loading state
  const handleMarkComplete = async (projectId: string) => {
    setLoading(projectId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onUpdateStatus(projectId, "complete")
    setLoading(null)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Site Location</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Timeline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.clientName}</TableCell>
                <TableCell>
                  {formatDate(project.startDate)} → {formatDate(project.endDate)}
                </TableCell>
                <TableCell>{getStatusBadge(project.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(project)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewTasks(project)}>
                        <Link href={`/dashboard/tasks?project=${project.id}`} className="flex items-center w-full">
                          <FileText className="mr-2 h-4 w-4" /> View Tasks
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDocuments(project)}>
                        <Link href={`/dashboard/documents?project=${project.id}`} className="flex items-center w-full">
                          <Folder className="mr-2 h-4 w-4" /> View Documents
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewInvoices(project)}>
                        <Link href={`/dashboard/invoices?project=${project.id}`} className="flex items-center w-full">
                          <Receipt className="mr-2 h-4 w-4" /> View Invoices
                        </Link>
                      </DropdownMenuItem>
                      {project.status !== "complete" && (
                        <DropdownMenuItem
                          disabled={loading === project.id}
                          onClick={() => handleMarkComplete(project.id)}
                        >
                          <CheckSquare className="mr-2 h-4 w-4" />
                          {loading === project.id ? "Processing..." : "Mark as Complete"}
                        </DropdownMenuItem>
                      )}
                      {project.status !== "on-hold" && (
                        <DropdownMenuItem disabled={loading === project.id} onClick={() => handleArchive(project.id)}>
                          <Archive className="mr-2 h-4 w-4" />
                          {loading === project.id ? "Processing..." : "Archive Project"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
