"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "../invoices/date-range-picker"
import type { DateRange } from "react-day-picker"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Edit, Filter, MapPin, CheckCircle, X, Calendar, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"

// Mock data for time entries
const initialTimeEntries = [
  {
    id: "time-1",
    staffId: "staff-1",
    staffName: "John Doe",
    date: "2023-07-10",
    clockIn: "08:00",
    clockOut: "16:30",
    totalHours: 8.5,
    site: "site-a",
    siteName: "Site A - London Office",
    notes: "Completed electrical wiring on the second floor.",
    status: "approved",
    location: "London, Site A (51.5074° N, 0.1278° W)",
  },
  {
    id: "time-2",
    staffId: "staff-2",
    staffName: "Sarah Smith",
    date: "2023-07-10",
    clockIn: "07:45",
    clockOut: "15:15",
    totalHours: 7.5,
    site: "site-b",
    siteName: "Site B - Manchester Residence",
    notes: "Installed plumbing fixtures in the main bathroom.",
    status: "pending",
    location: "Manchester, Site B (53.4808° N, 2.2426° W)",
  },
  {
    id: "time-3",
    staffId: "staff-3",
    staffName: "Mike Johnson",
    date: "2023-07-10",
    clockIn: "08:30",
    clockOut: "17:00",
    totalHours: 8.5,
    site: "site-c",
    siteName: "Site C - Birmingham Commercial",
    notes: "Framed interior walls on the first floor.",
    status: "approved",
    location: "Birmingham, Site C (52.4862° N, 1.8904° W)",
  },
  {
    id: "time-4",
    staffId: "staff-1",
    staffName: "John Doe",
    date: "2023-07-09",
    clockIn: "08:15",
    clockOut: "16:45",
    totalHours: 8.5,
    site: "site-a",
    siteName: "Site A - London Office",
    notes: "Installed light fixtures throughout the building.",
    status: "approved",
    location: "London, Site A (51.5074° N, 0.1278° W)",
  },
  {
    id: "time-5",
    staffId: "staff-4",
    staffName: "Lisa Brown",
    date: "2023-07-09",
    clockIn: "09:00",
    clockOut: "17:30",
    totalHours: 8.5,
    site: "site-d",
    siteName: "Site D - Edinburgh Hospital",
    notes: "Painted interior walls in the east wing.",
    status: "pending",
    location: "Edinburgh, Site D (55.9533° N, 3.1883° W)",
  },
  {
    id: "time-6",
    staffId: "staff-5",
    staffName: "David Wilson",
    date: "2023-07-09",
    clockIn: "07:30",
    clockOut: "16:00",
    totalHours: 8.5,
    site: "site-b",
    siteName: "Site B - Manchester Residence",
    notes: "General labor and site cleanup.",
    status: "approved",
    location: "Manchester, Site B (53.4808° N, 2.2426° W)",
  },
  {
    id: "time-7",
    staffId: "staff-2",
    staffName: "Sarah Smith",
    date: "2023-07-08",
    clockIn: "08:00",
    clockOut: "12:00",
    totalHours: 4,
    site: "site-c",
    siteName: "Site C - Birmingham Commercial",
    notes: "Half day - installed bathroom fixtures.",
    status: "approved",
    location: "Birmingham, Site C (52.4862° N, 1.8904° W)",
  },
  {
    id: "time-8",
    staffId: "staff-3",
    staffName: "Mike Johnson",
    date: "2023-07-08",
    clockIn: "08:30",
    clockOut: "17:00",
    totalHours: 8.5,
    site: "site-a",
    siteName: "Site A - London Office",
    notes: "Installed kitchen cabinets.",
    status: "pending",
    location: "London, Site A (51.5074° N, 0.1278° W)",
  },
  {
    id: "time-9",
    staffId: "staff-1",
    staffName: "John Doe",
    date: "2023-07-07",
    clockIn: "08:00",
    clockOut: "16:30",
    totalHours: 8.5,
    site: "site-d",
    siteName: "Site D - Edinburgh Hospital",
    notes: "Electrical work in the west wing.",
    status: "approved",
    location: "Edinburgh, Site D (55.9533° N, 3.1883° W)",
  },
  {
    id: "time-10",
    staffId: "staff-4",
    staffName: "Lisa Brown",
    date: "2023-07-07",
    clockIn: "09:00",
    clockOut: "17:30",
    totalHours: 8.5,
    site: "site-c",
    siteName: "Site C - Birmingham Commercial",
    notes: "Painted exterior trim.",
    status: "approved",
    location: "Birmingham, Site C (52.4862° N, 1.8904° W)",
  },
]

// Mock data for staff
const staffMembers = [
  { id: "staff-1", name: "John Doe" },
  { id: "staff-2", name: "Sarah Smith" },
  { id: "staff-3", name: "Mike Johnson" },
  { id: "staff-4", name: "Lisa Brown" },
  { id: "staff-5", name: "David Wilson" },
]

// Mock data for sites
const sites = [
  { id: "site-a", name: "Site A - London Office" },
  { id: "site-b", name: "Site B - Manchester Residence" },
  { id: "site-c", name: "Site C - Birmingham Commercial" },
  { id: "site-d", name: "Site D - Edinburgh Hospital" },
]

export function LoggedTimeSection() {
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries)
  const [staffFilter, setStaffFilter] = useState("")
  const [siteFilter, setSiteFilter] = useState("")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [editingEntry, setEditingEntry] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    staffId: "",
    date: new Date().toISOString().split("T")[0],
    clockIn: "09:00",
    clockOut: "17:00",
    site: "",
    notes: "",
  })

  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Filter time entries
  const filteredEntries = timeEntries.filter((entry) => {
    // Filter by staff
    if (staffFilter && entry.staffId !== staffFilter) return false

    // Filter by site
    if (siteFilter && entry.site !== siteFilter) return false

    // Filter by date range
    if (dateRange.from) {
      const entryDate = new Date(entry.date)
      if (entryDate < dateRange.from) return false
    }

    if (dateRange.to) {
      const entryDate = new Date(entry.date)
      if (entryDate > dateRange.to) return false
    }

    return true
  })

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  // Format time
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Handle approve time entry
  const handleApproveEntry = (entry: any) => {
    setTimeEntries(timeEntries.map((item) => (item.id === entry.id ? { ...item, status: "approved" } : item)))

    toast({
      title: "Time Entry Approved",
      description: `Time entry for ${entry.staffName} on ${formatDate(entry.date)} has been approved`,
    })
  }

  // Handle edit time entry
  const handleEditEntry = (entry: any) => {
    setEditingEntry(entry)
    setIsEditModalOpen(true)
  }

  // Handle save edited entry
  const handleSaveEdit = () => {
    if (!editingEntry) return

    setTimeEntries(timeEntries.map((item) => (item.id === editingEntry.id ? editingEntry : item)))

    toast({
      title: "Time Entry Updated",
      description: `Time entry for ${editingEntry.staffName} on ${formatDate(editingEntry.date)} has been updated`,
    })

    setIsEditModalOpen(false)
    setEditingEntry(null)
  }

  // Handle add new time entry
  const handleAddEntry = () => {
    if (!newEntry.staffId || !newEntry.site) {
      toast({
        title: "Missing Information",
        description: "Please select a staff member and job site",
        variant: "destructive",
      })
      return
    }

    const staffMember = staffMembers.find((staff) => staff.id === newEntry.staffId)
    const site = sites.find((s) => s.id === newEntry.site)

    if (!staffMember || !site) return

    // Calculate total hours
    const [inHours, inMinutes] = newEntry.clockIn.split(":").map(Number)
    const [outHours, outMinutes] = newEntry.clockOut.split(":").map(Number)

    const inTime = inHours * 60 + inMinutes
    const outTime = outHours * 60 + outMinutes
    const totalMinutes = outTime - inTime
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10

    const newTimeEntry = {
      id: `time-${Date.now()}`,
      staffId: newEntry.staffId,
      staffName: staffMember.name,
      date: newEntry.date,
      clockIn: newEntry.clockIn,
      clockOut: newEntry.clockOut,
      totalHours,
      site: newEntry.site,
      siteName: site.name,
      notes: newEntry.notes,
      status: "pending",
      location: `${site.name.split(" - ")[0]} (Location data not available)`,
    }

    setTimeEntries([newTimeEntry, ...timeEntries])

    toast({
      title: "Time Entry Added",
      description: `Manual time entry for ${staffMember.name} on ${formatDate(newEntry.date)} has been added`,
    })

    setIsAddModalOpen(false)
    setNewEntry({
      staffId: "",
      date: new Date().toISOString().split("T")[0],
      clockIn: "09:00",
      clockOut: "17:00",
      site: "",
      notes: "",
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    let className = ""
    const label = status.charAt(0).toUpperCase() + status.slice(1)

    switch (status) {
      case "approved":
        className = "bg-green-500/10 text-green-500 border-green-500/20"
        break
      case "pending":
        className = "bg-amber-500/10 text-amber-500 border-amber-500/20"
        break
      default:
        className = "bg-muted/50 text-muted-foreground"
    }

    return (
      <Badge variant="outline" className={`rounded-xl ${className}`}>
        {label}
      </Badge>
    )
  }

  // Render table view
  const renderTableView = () => (
    <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.staffName}</TableCell>
              <TableCell>{formatDate(entry.date)}</TableCell>
              <TableCell>{formatTime(entry.clockIn)}</TableCell>
              <TableCell>{formatTime(entry.clockOut)}</TableCell>
              <TableCell>{entry.totalHours}</TableCell>
              <TableCell>{entry.siteName.split(" - ")[0]}</TableCell>
              <TableCell>{getStatusBadge(entry.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  {entry.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl text-green-500 hover:text-green-600 hover:bg-green-500/10"
                      onClick={() => handleApproveEntry(entry)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  // Render card view
  const renderCardView = () => (
    <div className="space-y-4">
      {filteredEntries.map((entry) => (
        <Card key={entry.id} className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">{entry.staffName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
              </div>
            </div>
            {getStatusBadge(entry.status)}
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Clock In</div>
                <div className="font-medium">{formatTime(entry.clockIn)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Clock Out</div>
                <div className="font-medium">{formatTime(entry.clockOut)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Hours</div>
                <div className="font-medium">{entry.totalHours}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Site</div>
                <div className="font-medium">{entry.siteName.split(" - ")[0]}</div>
              </div>
            </div>
            {entry.notes && (
              <div className="mt-2 text-sm">
                <div className="text-muted-foreground">Notes</div>
                <div>{entry.notes}</div>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => handleEditEntry(entry)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {entry.status === "pending" && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-green-500 hover:text-green-600 hover:bg-green-500/10"
                onClick={() => handleApproveEntry(entry)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Staff Filter */}
          <Select value={staffFilter} onValueChange={setStaffFilter}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Staff Member" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Site Filter */}
          <Select value={siteFilter} onValueChange={setSiteFilter}>
            <SelectTrigger className="h-9 rounded-2xl w-[160px] border-dashed">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Job Site" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name.split(" - ")[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <div className="h-9 rounded-2xl border border-dashed border-input px-3 flex items-center">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground mr-2" />
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          {/* Clear Filters Button */}
          {(staffFilter || siteFilter || dateRange.from || dateRange.to) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-2xl"
              onClick={() => {
                setStaffFilter("")
                setSiteFilter("")
                setDateRange({ from: undefined, to: undefined })
              }}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Add Manual Time Entry Button */}
        <Button className="rounded-2xl" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Manual Entry
        </Button>
      </div>

      {/* Time Entries */}
      {filteredEntries.length > 0 ? (
        isMobile ? (
          renderCardView()
        ) : (
          renderTableView()
        )
      ) : (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
          <h3 className="mt-4 text-lg font-medium">No time entries found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add a new time entry</p>
        </div>
      )}

      {/* Edit Time Entry Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
          </DialogHeader>

          {editingEntry && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="edit-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl",
                          !editingEntry.date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingEntry.date ? format(new Date(editingEntry.date), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(editingEntry.date)}
                        onSelect={(date) =>
                          setEditingEntry({
                            ...editingEntry,
                            date: date ? format(date, "yyyy-MM-dd") : editingEntry.date,
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-site">Job Site</Label>
                  <Select
                    value={editingEntry.site}
                    onValueChange={(value) => {
                      const site = sites.find((s) => s.id === value)
                      setEditingEntry({
                        ...editingEntry,
                        site: value,
                        siteName: site ? site.name : editingEntry.siteName,
                      })
                    }}
                  >
                    <SelectTrigger id="edit-site" className="rounded-xl">
                      <SelectValue placeholder="Select job site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-clock-in">Clock In Time</Label>
                  <Input
                    id="edit-clock-in"
                    type="time"
                    value={editingEntry.clockIn}
                    onChange={(e) => setEditingEntry({ ...editingEntry, clockIn: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-clock-out">Clock Out Time</Label>
                  <Input
                    id="edit-clock-out"
                    type="time"
                    value={editingEntry.clockOut}
                    onChange={(e) => setEditingEntry({ ...editingEntry, clockOut: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingEntry.notes}
                  onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  className="rounded-xl min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Manual Time Entry Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => !open && setIsAddModalOpen(false)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Manual Time Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-staff">
                Staff Member <span className="text-destructive">*</span>
              </Label>
              <Select value={newEntry.staffId} onValueChange={(value) => setNewEntry({ ...newEntry, staffId: value })}>
                <SelectTrigger id="add-staff" className="rounded-xl">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="add-date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="add-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl",
                        !newEntry.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEntry.date ? format(new Date(newEntry.date), "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(newEntry.date)}
                      onSelect={(date) =>
                        setNewEntry({
                          ...newEntry,
                          date: date ? format(date, "yyyy-MM-dd") : newEntry.date,
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-site">
                  Job Site <span className="text-destructive">*</span>
                </Label>
                <Select value={newEntry.site} onValueChange={(value) => setNewEntry({ ...newEntry, site: value })}>
                  <SelectTrigger id="add-site" className="rounded-xl">
                    <SelectValue placeholder="Select job site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-clock-in">
                  Clock In Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="add-clock-in"
                  type="time"
                  value={newEntry.clockIn}
                  onChange={(e) => setNewEntry({ ...newEntry, clockIn: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-clock-out">
                  Clock Out Time <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="add-clock-out"
                  type="time"
                  value={newEntry.clockOut}
                  onChange={(e) => setNewEntry({ ...newEntry, clockOut: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="add-notes">Notes (Optional)</Label>
              <Textarea
                id="add-notes"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                className="rounded-xl min-h-[100px]"
                placeholder="Add any notes about this time entry..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl" onClick={handleAddEntry}>
              Add Time Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
