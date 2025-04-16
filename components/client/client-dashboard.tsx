"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building2, FileText, Receipt, Clock, ArrowRight, Download } from "lucide-react"
import Link from "next/link"

// Mock data for client dashboard
const getClientData = (clientId: string) => {
  // TODO: Replace with actual API call to get client data
  return {
    name: "Oakwood Properties",
    activeProjects: 3,
    pendingInvoices: 2,
    pendingContracts: 1,
    recentDocuments: [
      { id: "doc-1", name: "Site A - Building Permit.pdf", date: "2023-06-15", projectName: "London Office" },
      {
        id: "doc-2",
        name: "Client Contract - Oakwood Properties.pdf",
        date: "2023-06-10",
        projectName: "London Office",
      },
      { id: "doc-3", name: "Site B - Floor Plans.jpg", date: "2023-06-05", projectName: "Manchester Residence" },
    ],
    pendingInvoices: [
      { id: "INV-2023-005", amount: 45000, dueDate: "2023-07-15", projectName: "London Office" },
      { id: "INV-2023-009", amount: 35000, dueDate: "2023-08-05", projectName: "Manchester Residence" },
    ],
    pendingContracts: [
      {
        id: "contract-2",
        title: "Metro Commercial - Renovation Contract",
        date: "2023-06-20",
        projectName: "Manchester Residence",
      },
    ],
  }
}

interface ClientDashboardProps {
  clientId: string
}

export function ClientDashboard({ clientId }: ClientDashboardProps) {
  const [clientData, setClientData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      const data = getClientData(clientId)
      setClientData(data)
      setIsLoading(false)
    }

    fetchData()
  }, [clientId])

  if (isLoading) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="h-40"></CardContent>
        </Card>
      </div>
    )
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="grid gap-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              Active Projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clientData.activeProjects}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/projects" className="text-xs text-muted-foreground hover:underline">
              View all projects
            </Link>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Receipt className="mr-2 h-4 w-4" />
              Pending Invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clientData.pendingInvoices.length}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/invoices" className="text-xs text-muted-foreground hover:underline">
              View all invoices
            </Link>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Pending Contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clientData.pendingContracts.length}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/contracts" className="text-xs text-muted-foreground hover:underline">
              View all contracts
            </Link>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              Recent Documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{clientData.recentDocuments.length}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/documents" className="text-xs text-muted-foreground hover:underline">
              View all documents
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
          <CardDescription>Items that require your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="invoices">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="invoices">Pending Invoices</TabsTrigger>
              <TabsTrigger value="contracts">Pending Contracts</TabsTrigger>
              <TabsTrigger value="documents">Recent Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="mt-4 space-y-4">
              {clientData.pendingInvoices.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending invoices</p>
              ) : (
                clientData.pendingInvoices.map((invoice: any) => (
                  <Card key={invoice.id} className="overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">{invoice.projectName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl"
                          >
                            Pending
                          </Badge>
                          <span className="text-xs text-muted-foreground">Due: {formatDate(invoice.dueDate)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-lg font-bold">{formatCurrency(invoice.amount)}</p>
                        <Link href={`/dashboard/invoices#${invoice.id}`}>
                          <Button size="sm" className="rounded-xl">
                            Pay Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))
              )}

              <div className="flex justify-end">
                <Link href="/dashboard/invoices">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    View All Invoices
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="mt-4 space-y-4">
              {clientData.pendingContracts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No pending contracts</p>
              ) : (
                clientData.pendingContracts.map((contract: any) => (
                  <Card key={contract.id} className="overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{contract.title}</p>
                        <p className="text-sm text-muted-foreground">{contract.projectName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl"
                          >
                            Awaiting Signature
                          </Badge>
                          <span className="text-xs text-muted-foreground">Created: {formatDate(contract.date)}</span>
                        </div>
                      </div>
                      <Link href={`/dashboard/contracts#${contract.id}`}>
                        <Button size="sm" className="rounded-xl">
                          Review & Sign
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))
              )}

              <div className="flex justify-end">
                <Link href="/dashboard/contracts">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    View All Contracts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-4 space-y-4">
              {clientData.recentDocuments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent documents</p>
              ) : (
                clientData.recentDocuments.map((document: any) => (
                  <Card key={document.id} className="overflow-hidden">
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">{document.projectName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">Uploaded: {formatDate(document.date)}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </Card>
                ))
              )}

              <div className="flex justify-end">
                <Link href="/dashboard/documents">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    View All Documents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
