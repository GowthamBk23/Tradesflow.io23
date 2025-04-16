"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProjectsFilters } from "@/components/projects/projects-filters"
import { ProjectsTable } from "@/components/projects/projects-table"
import { ProjectsCardView } from "@/components/projects/projects-card-view"
import { CreateEditProjectModal } from "@/components/projects/create-edit-project-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Sample project data
const projectsData = [
  {
    id: "proj1",
    name: "Riverside Apartments",
    location: "123 River St, London",
    clientId: "client1",
    clientName: "Riverside Corp",
    startDate: "2023-06-15",
    endDate: "2023-12-20",
    status: "ongoing",
    progress: 65,
    budget: "£1,250,000",
    description: "Construction of a new 24-unit apartment building with underground parking.",
  },
  {
    id: "proj2",
    name: "Metro Office Renovation",
    location: "45 Central Ave, Manchester",
    clientId: "client2",
    clientName: "Metro Business",
    startDate: "2023-04-10",
    endDate: "2023-08-30",
    status: "complete",
    progress: 100,
    budget: "£450,000",
    description: "Complete renovation of 3-floor office space including new HVAC and electrical systems.",
  },
  {
    id: "proj3",
    name: "Oakwood Residential Development",
    location: "Oakwood Heights, Birmingham",
    clientId: "client3",
    clientName: "Oakwood Properties",
    startDate: "2023-07-01",
    endDate: "2024-05-15",
    status: "ongoing",
    progress: 30,
    budget: "£3,200,000",
    description: "Development of 15 luxury homes in a gated community with shared amenities.",
  },
  {
    id: "proj4",
    name: "Sunset Mall Expansion",
    location: "Sunset Boulevard, Liverpool",
    clientId: "client4",
    clientName: "Sunset Homes",
    startDate: "2023-02-20",
    endDate: "2023-11-10",
    status: "on-hold",
    progress: 45,
    budget: "£1,800,000",
    description: "Expansion of existing mall with 12 new retail spaces and food court renovation.",
  },
  {
    id: "proj5",
    name: "Highland Park Landscaping",
    location: "Highland Park, Edinburgh",
    clientId: "client1",
    clientName: "Riverside Corp",
    startDate: "2023-05-05",
    endDate: "2023-07-15",
    status: "complete",
    progress: 100,
    budget: "£180,000",
    description: "Complete landscaping of new public park including playground installation and water features.",
  },
]

export default function ProjectsPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const shouldOpenModal = searchParams.get("new") === "true"

  const [projects, setProjects] = useState(projectsData)
  const [filteredProjects, setFilteredProjects] = useState(projectsData)
  const [viewType, setViewType] = useState<"table" | "card">("table")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<any>(null)

  // Initialize filters with default values
  const [filters, setFilters] = useState({
    search: "",
    status: "all", // Changed from empty string to "all"
    client: "all", // Changed from empty string to "all"
    location: "all", // Changed from empty string to "all"
  })

  // Check if we should open the create modal on initial load
  useEffect(() => {
    if (shouldOpenModal) {
      setIsCreateModalOpen(true)
    }
  }, [shouldOpenModal])

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...projectsData]

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.location.toLowerCase().includes(searchLower) ||
          project.clientName.toLowerCase().includes(searchLower),
      )
    }

    if (filters.status && filters.status !== "all") {
      result = result.filter((project) => project.status === filters.status)
    }

    if (filters.client && filters.client !== "all") {
      result = result.filter((project) => project.clientId === filters.client)
    }

    if (filters.location && filters.location !== "all") {
      const locationLower = filters.location.toLowerCase()
      result = result.filter((project) => project.location.toLowerCase().includes(locationLower))
    }

    setFilteredProjects(result)
  }, [filters])

  const handleCreateProject = () => {
    setCurrentProject(null)
    setIsCreateModalOpen(true)
  }

  const handleEditProject = (project: any) => {
    setCurrentProject(project)
    setIsCreateModalOpen(true)
  }

  const handleSaveProject = (projectData: any) => {
    if (currentProject) {
      // Update existing project
      setProjects((prev) => prev.map((p) => (p.id === projectData.id ? { ...projectData } : p)))
    } else {
      // Add new project
      setProjects((prev) => [...prev, projectData])
    }

    setIsCreateModalOpen(false)

    // Apply filters to updated projects
    let result = [...projects]
    if (currentProject) {
      result = result.map((p) => (p.id === projectData.id ? { ...projectData } : p))
    } else {
      result = [...result, projectData]
    }

    // Re-apply current filters
    if (
      filters.search ||
      (filters.status && filters.status !== "all") ||
      (filters.client && filters.client !== "all") ||
      (filters.location && filters.location !== "all")
    ) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(
          (project) =>
            project.name.toLowerCase().includes(searchLower) ||
            project.location.toLowerCase().includes(searchLower) ||
            project.clientName.toLowerCase().includes(searchLower),
        )
      }

      if (filters.status && filters.status !== "all") {
        result = result.filter((project) => project.status === filters.status)
      }

      if (filters.client && filters.client !== "all") {
        result = result.filter((project) => project.clientId === filters.client)
      }

      if (filters.location && filters.location !== "all") {
        const locationLower = filters.location.toLowerCase()
        result = result.filter((project) => project.location.toLowerCase().includes(locationLower))
      }
    }

    setFilteredProjects(result)
  }

  const handleUpdateProjectStatus = (projectId: string, newStatus: string) => {
    // Update project status
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)))

    // Update filtered projects
    setFilteredProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)))

    toast({
      title: "Project Updated",
      description: `Project status changed to ${newStatus}.`,
    })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Projects" description="Manage your construction projects.">
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </DashboardHeader>

      <ProjectsFilters viewType={viewType} setViewType={setViewType} filters={filters} setFilters={setFilters} />

      {viewType === "table" ? (
        <ProjectsTable
          projects={filteredProjects}
          onEdit={handleEditProject}
          onUpdateStatus={handleUpdateProjectStatus}
          filters={filters}
        />
      ) : (
        <ProjectsCardView
          projects={filteredProjects}
          onEdit={handleEditProject}
          onUpdateStatus={handleUpdateProjectStatus}
          filters={filters}
        />
      )}

      <CreateEditProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveProject}
        project={currentProject}
      />
    </DashboardShell>
  )
}
