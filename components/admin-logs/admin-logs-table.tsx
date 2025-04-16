"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Clipboard,
  Clock,
  FileText,
  FileUp,
  FileCheck,
  User,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

// Initial mock data for logs
const initialLogs = [
  {
    id: 1,
    timestamp: "Apr 4, 2025 10:42 AM",
    user: "Jamie Wilson",
    userRole: "staff",
    action: "Clocked in at Site A",
    type: "time",
    status: "success",
  },
  {
    id: 2,
    timestamp: "Apr 4, 2025 10:30 AM",
    user: "Sarah Johnson",
    userRole: "admin",
    action: "Sent Invoice #402 to ACME Ltd.",
    type: "invoice",
    status: "success",
  },
  {
    id: 3,
    timestamp: "Apr 4, 2025 09:15 AM",
    user: "Michael Chen",
    userRole: "staff",
    action: "Uploaded Site Plan.pdf to Project Elmhurst",
    type: "document",
    status: "success",
  },
  {
    id: 4,
    timestamp: "Apr 4, 2025 08:45 AM",
    user: "Lisa Rodriguez",
    userRole: "staff",
    action: "Updated Task: Plastering work marked as complete",
    type: "task",
    status: "success",
  },
  {
    id: 5,
    timestamp: "Apr 3, 2025 05:30 PM",
    user: "David Smith",
    userRole: "client",
    action: "Approved Quote #89 for Bathroom Renovation",
    type: "invoice",
    status: "success",
  },
  {
    id: 6,
    timestamp: "Apr 3, 2025 04:22 PM",
    user: "Jamie Wilson",
    userRole: "staff",
    action: "Clocked out from Site A",
    type: "time",
    status: "success",
  },
  {
    id: 7,
    timestamp: "Apr 3, 2025 03:15 PM",
    user: "Sarah Johnson",
    userRole: "admin",
    action: "Created new client: Horizon Properties",
    type: "client",
    status: "success",
  },
  {
    id: 8,
    timestamp: "Apr 3, 2025 02:10 PM",
    user: "Michael Chen",
    userRole: "staff",
    action: "Failed to upload large file: Blueprint-Full.pdf (>25MB)",
    type: "document",
    status: "error",
  },
  {
    id: 9,
    timestamp: "Apr 3, 2025 01:45 PM",
    user: "Lisa Rodriguez",
    userRole: "staff",
    action: "Created Task: Install new fixtures at 123 Main St",
    type: "task",
    status: "success",
  },
  {
    id: 10,
    timestamp: "Apr 3, 2025 11:30 AM",
    user: "David Smith",
    userRole: "client",
    action: "Viewed Invoice #398",
    type: "invoice",
    status: "info",
  },
]

// Additional logs to load when clicking "Load More"
const additionalLogs = [
  {
    id: 11,
    timestamp: "Apr 3, 2025 10:15 AM",
    user: "Jamie Wilson",
    userRole: "staff",
    action: "Updated client contact information for Riverside Apartments",
    type: "client",
    status: "success",
  },
  {
    id: 12,
    timestamp: "Apr 3, 2025 09:45 AM",
    user: "Sarah Johnson",
    userRole: "admin",
    action: "Generated monthly financial report",
    type: "invoice",
    status: "success",
  },
  {
    id: 13,
    timestamp: "Apr 3, 2025 09:30 AM",
    user: "Michael Chen",
    userRole: "staff",
    action: "Requested materials for Project Oakwood",
    type: "document",
    status: "info",
  },
  {
    id: 14,
    timestamp: "Apr 2, 2025 05:45 PM",
    user: "Lisa Rodriguez",
    userRole: "staff",
    action: "Completed task: Final inspection at 456 Oak Street",
    type: "task",
    status: "success",
  },
  {
    id: 15,
    timestamp: "Apr 2, 2025 04:30 PM",
    user: "David Smith",
    userRole: "client",
    action: "Paid Invoice #395",
    type: "invoice",
    status: "success",
  },
]

// Helper function to get icon based on log type
const getLogIcon = (type: string) => {
  switch (type) {
    case "task":
      return <Clipboard className="h-4 w-4 text-blue-400" />
    case "invoice":
      return <CreditCard className="h-4 w-4 text-green-400" />
    case "document":
      return <FileUp className="h-4 w-4 text-amber-400" />
    case "time":
      return <Clock className="h-4 w-4 text-purple-400" />
    case "client":
      return <User className="h-4 w-4 text-pink-400" />
    default:
      return <FileText className="h-4 w-4 text-gray-400" />
  }
}

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "info":
      return <FileCheck className="h-4 w-4 text-blue-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

// Helper function to get role badge variant
const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "default"
    case "staff":
      return "secondary"
    case "client":
      return "outline"
    default:
      return "secondary"
  }
}

export default function AdminLogsTable() {
  const { toast } = useToast()
  const [logs, setLogs] = useState(initialLogs)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const handleLoadMore = () => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      if (logs.length === initialLogs.length) {
        setLogs([...logs, ...additionalLogs])
        toast({
          title: "Logs loaded",
          description: "Additional logs have been loaded.",
        })
      } else {
        setHasMore(false)
        toast({
          title: "No more logs",
          description: "You've reached the end of the available logs.",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[180px]">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{log.user}</span>
                    <Badge variant={getRoleBadgeVariant(log.userRole)}>{log.userRole}</Badge>
                  </div>
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getLogIcon(log.type)}
                    <span className="capitalize text-xs">{log.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(log.status)}
                    <span className="sr-only">{log.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center p-4">
        {hasMore ? (
          <Button variant="outline" size="sm" onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Logs"
            )}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">No more logs to load</p>
        )}
      </div>
    </div>
  )
}
