"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, AlertTriangle, MessageCircle, MapPin, Calendar } from "lucide-react"
import { format, isToday, isPast, addDays, isFuture } from "date-fns"
import { useToast } from "@/hooks/use-toast"

// Mock data for staff tasks
const getStaffTasks = (staffId: string) => {
  return {
    todo: [
      {
        id: "task-1",
        title: "Install kitchen cabinets",
        description: "Install all kitchen cabinets according to the floor plan",
        assignee: staffId,
        assigneeName: "John Doe",
        jobSite: "Site A - London Office",
        dueDate: "2025-04-10",
        priority: "High",
        comments: [
          {
            id: "comment-1",
            author: "Project Manager",
            text: "Make sure to use the new hardware we received yesterday",
            timestamp: "2025-04-05T10:30:00",
          },
        ],
      },
      {
        id: "task-3",
        title: "Fix bathroom plumbing",
        description: "Repair leaking pipe in main bathroom",
        assignee: staffId,
        assigneeName: "John Doe",
        jobSite: "Site A - London Office",
        dueDate: "2025-04-08",
        priority: "High",
        comments: [],
      },
    ],
    inProgress: [
      {
        id: "task-4",
        title: "Install flooring in bedroom",
        description: "Install hardwood flooring in master bedroom",
        assignee: staffId,
        assigneeName: "John Doe",
        jobSite: "Site C - Birmingham Commercial",
        dueDate: "2025-04-15",
        priority: "Medium",
        comments: [],
      },
    ],
    complete: [
      {
        id: "task-7",
        title: "Foundation work",
        description: "Complete foundation preparation",
        assignee: staffId,
        assigneeName: "John Doe",
        jobSite: "Site A - London Office",
        dueDate: "2025-04-05",
        priority: "High",
        completedDate: "2025-04-04",
        comments: [],
      },
    ],
  }
}

interface StaffTasksListProps {
  staffId: string
  isLoading: boolean
}

export function StaffTasksList({ staffId, isLoading }: StaffTasksListProps) {
  const [tasks, setTasks] = useState<any>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [commentText, setCommentText] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const { toast } = useToast()

  // Load tasks
  useState(() => {
    const staffTasks = getStaffTasks(staffId)
    setTasks(staffTasks)
  })

  if (isLoading || !tasks) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-48 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Get all tasks in a flat array
  const allTasks = [...tasks.todo, ...tasks.inProgress, ...tasks.complete]

  // Filter tasks based on active filter
  const filterTasks = (taskList: any[]) => {
    if (activeFilter === "all") return taskList
    if (activeFilter === "today") return taskList.filter((task) => isToday(new Date(task.dueDate)))
    if (activeFilter === "overdue")
      return taskList.filter((task) => isPast(new Date(task.dueDate)) && !task.completedDate)
    if (activeFilter === "upcoming")
      return taskList.filter(
        (task) => isFuture(new Date(task.dueDate)) && new Date(task.dueDate) <= addDays(new Date(), 7),
      )
    if (activeFilter === "high") return taskList.filter((task) => task.priority === "High")
    return taskList
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d MMM yyyy")
  }

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 rounded-xl">
            High
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-xl">
            Medium
          </Badge>
        )
      case "Low":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 rounded-xl">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Handle mark as complete
  const handleMarkComplete = (taskId: string) => {
    // Find the task
    const taskToComplete = [...tasks.todo, ...tasks.inProgress].find((task) => task.id === taskId)

    if (!taskToComplete) return

    // Remove from current status
    const newTasks = { ...tasks }
    if (tasks.todo.find((t: any) => t.id === taskId)) {
      newTasks.todo = tasks.todo.filter((t: any) => t.id !== taskId)
    } else if (tasks.inProgress.find((t: any) => t.id === taskId)) {
      newTasks.inProgress = tasks.inProgress.filter((t: any) => t.id !== taskId)
    }

    // Add to complete with completion date
    newTasks.complete = [
      ...tasks.complete,
      { ...taskToComplete, completedDate: new Date().toISOString().split("T")[0] },
    ]

    setTasks(newTasks)

    toast({
      title: "Task Completed",
      description: `Task "${taskToComplete.title}" has been marked as complete.`,
    })
  }

  // Handle add comment
  const handleAddComment = () => {
    if (!commentText.trim() || !selectedTask) return

    const newComment = {
      id: `comment-${Date.now()}`,
      author: "John Doe",
      text: commentText.trim(),
      timestamp: new Date().toISOString(),
    }

    // Find and update the task
    const newTasks = { ...tasks }

    // Check each status array
    for (const status of ["todo", "inProgress", "complete"]) {
      const taskIndex = newTasks[status].findIndex((t: any) => t.id === selectedTask.id)
      if (taskIndex !== -1) {
        newTasks[status][taskIndex] = {
          ...newTasks[status][taskIndex],
          comments: [...newTasks[status][taskIndex].comments, newComment],
        }
        break
      }
    }

    setTasks(newTasks)
    setCommentText("")

    toast({
      title: "Comment Added",
      description: "Your comment has been added to the task.",
    })
  }

  // Handle start task
  const handleStartTask = (taskId: string) => {
    // Find the task
    const taskToStart = tasks.todo.find((t: any) => t.id === taskId)

    if (!taskToStart) return

    // Remove from todo
    const newTasks = { ...tasks }
    newTasks.todo = tasks.todo.filter((t: any) => t.id !== taskId)

    // Add to in progress
    newTasks.inProgress = [...tasks.inProgress, taskToStart]

    setTasks(newTasks)

    toast({
      title: "Task Started",
      description: `You've started working on "${taskToStart.title}".`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Task Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-xl"
          onClick={() => setActiveFilter("all")}
        >
          All Tasks
        </Button>
        <Button
          variant={activeFilter === "today" ? "default" : "outline"}
          size="sm"
          className="rounded-xl"
          onClick={() => setActiveFilter("today")}
        >
          <Clock className="mr-1 h-4 w-4" />
          Due Today
        </Button>
        <Button
          variant={activeFilter === "overdue" ? "default" : "outline"}
          size="sm"
          className="rounded-xl"
          onClick={() => setActiveFilter("overdue")}
        >
          <AlertTriangle className="mr-1 h-4 w-4" />
          Overdue
        </Button>
        <Button
          variant={activeFilter === "upcoming" ? "default" : "outline"}
          size="sm"
          className="rounded-xl"
          onClick={() => setActiveFilter("upcoming")}
        >
          <Calendar className="mr-1 h-4 w-4" />
          Next 7 Days
        </Button>
        <Button
          variant={activeFilter === "high" ? "default" : "outline"}
          size="sm"
          className="rounded-xl"
          onClick={() => setActiveFilter("high")}
        >
          High Priority
        </Button>
      </div>

      {/* Tasks List */}
      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todo">To Do ({filterTasks(tasks.todo).length})</TabsTrigger>
          <TabsTrigger value="inProgress">In Progress ({filterTasks(tasks.inProgress).length})</TabsTrigger>
          <TabsTrigger value="complete">Complete ({filterTasks(tasks.complete).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todo" className="mt-4 space-y-4">
          {filterTasks(tasks.todo).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                <p className="mt-4 text-lg font-medium">No tasks to do</p>
                <p className="text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            filterTasks(tasks.todo).map((task: any) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{task.jobSite}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">{getPriorityBadge(task.priority)}</div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{task.comments.length} comments</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedTask(task)}>
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Comment
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleStartTask(task.id)}>
                      Start Task
                    </Button>
                    <Button size="sm" className="rounded-xl" onClick={() => handleMarkComplete(task.id)}>
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="inProgress" className="mt-4 space-y-4">
          {filterTasks(tasks.inProgress).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground opacity-20" />
                <p className="mt-4 text-lg font-medium">No tasks in progress</p>
                <p className="text-muted-foreground">Start working on a task to see it here</p>
              </CardContent>
            </Card>
          ) : (
            filterTasks(tasks.inProgress).map((task: any) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{task.jobSite}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">{getPriorityBadge(task.priority)}</div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{task.comments.length} comments</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedTask(task)}>
                      <MessageCircle className="mr-1 h-4 w-4" />
                      Comment
                    </Button>
                    <Button size="sm" className="rounded-xl" onClick={() => handleMarkComplete(task.id)}>
                      Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="complete" className="mt-4 space-y-4">
          {filterTasks(tasks.complete).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                <p className="mt-4 text-lg font-medium">No completed tasks</p>
                <p className="text-muted-foreground">Complete a task to see it here</p>
              </CardContent>
            </Card>
          ) : (
            filterTasks(tasks.complete).map((task: any) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{task.jobSite}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Completed: {formatDate(task.completedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">{getPriorityBadge(task.priority)}</div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{task.comments.length} comments</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSelectedTask(task)}>
                      <MessageCircle className="mr-1 h-4 w-4" />
                      View Comments
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Comment Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Comments</h3>

              {selectedTask?.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              ) : (
                <div className="space-y-3">
                  {selectedTask?.comments.map((comment: any) => (
                    <div key={comment.id} className="rounded-lg border p-3 text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(comment.timestamp), "d MMM yyyy, h:mm a")}
                        </p>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!selectedTask?.completedDate && (
              <div className="space-y-2">
                <Label htmlFor="comment">Add Comment</Label>
                <Textarea
                  id="comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Type your comment here..."
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            {!selectedTask?.completedDate && (
              <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                Add Comment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
