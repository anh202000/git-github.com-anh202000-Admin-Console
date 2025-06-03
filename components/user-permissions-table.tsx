"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { Agent } from "./dashboard-view"

interface UserPermission {
  id: string
  userName: string
  userEmail: string
  userId: string
  agent: string
  catchup: string
  scope: "Browser Web" | "Catch up" | "Look up" // Updated scope type
}

const mockUserData: UserPermission[] = [
  {
    id: "1",
    userName: "Alice Wonderland",
    userEmail: "alice@example.com",
    userId: "U-ALC001",
    agent: "GoTeddy",
    catchup: "daily",
    scope: "Catch up", // Updated mock data
  },
  {
    id: "2",
    userName: "Bob The Builder",
    userEmail: "bob@example.com",
    userId: "U-BOB002",
    agent: "GoTeddy",
    catchup: "hourly",
    scope: "Browser Web", // Updated mock data
  },
  {
    id: "3",
    userName: "Charlie Brown",
    userEmail: "charlie@example.com",
    userId: "U-CHR003",
    agent: "GoTeddy",
    catchup: "weekly",
    scope: "Look up", // Updated mock data
  },
]

// Updated scope options
const scopeOptions = [
  { value: "Browser Web", label: "Browser Web" },
  { value: "Catch up", label: "Catch up" },
  { value: "Look up", label: "Look up" },
]

const catchupOptions = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
]

const ALL_AGENTS_VALUE = "__ALL_AGENTS__"

interface UserPermissionsTableProps {
  agents: Agent[]
}

export function UserPermissionsTable({ agents }: UserPermissionsTableProps) {
  const [data, setData] = useState<UserPermission[]>(mockUserData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<UserPermission | null>(null)
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit")
  const [selectedAgent, setSelectedAgent] = useState<string>(ALL_AGENTS_VALUE)
  const [searchTermUser, setSearchTermUser] = useState("")

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (selectedAgent === ALL_AGENTS_VALUE || item.agent === selectedAgent) &&
        (item.userName.toLowerCase().includes(searchTermUser.toLowerCase()) ||
          item.userEmail.toLowerCase().includes(searchTermUser.toLowerCase())),
    )
  }, [data, selectedAgent, searchTermUser])

  const handleEdit = (permission: UserPermission) => {
    setEditingPermission(permission)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingPermission(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = (permissionToSave: UserPermission) => {
    if (dialogMode === "edit" && editingPermission) {
      setData((prev) => prev.map((item) => (item.id === editingPermission.id ? permissionToSave : item)))
    } else {
      const newId = Date.now().toString()
      const newUserId = permissionToSave.userId || `U-NEW-${newId.slice(-4)}`
      setData((prev) => [...prev, { ...permissionToSave, id: newId, userId: newUserId }])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  const getScopeBadgeStyle = (scope: UserPermission["scope"]) => {
    switch (scope) {
      case "Browser Web":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200"
      case "Catch up":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "Look up":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="sm:w-[200px] lg:w-[250px]">
              <SelectValue placeholder="Filter by Agent..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_AGENTS_VALUE}>All Agents</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.name} disabled={!agent.name.trim()}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by User..."
              value={searchTermUser}
              onChange={(e) => setSearchTermUser(e.target.value)}
              className="pl-8 sm:w-[200px] lg:w-[250px]"
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add User Permission
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Catchup</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.userName}</TableCell>
                <TableCell>{item.userEmail}</TableCell>
                <TableCell>{item.userId}</TableCell>
                <TableCell>{item.agent}</TableCell>
                <TableCell>{item.catchup}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getScopeBadgeStyle(item.scope)}`}>
                    {item.scope}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserPermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permission={editingPermission}
        onSave={handleSave}
        mode={dialogMode}
        agents={agents}
      />
    </div>
  )
}

interface UserPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission: UserPermission | null
  onSave: (permission: UserPermission) => void
  mode: "edit" | "create"
  agents: Agent[]
}

function UserPermissionDialog({ open, onOpenChange, permission, onSave, mode, agents }: UserPermissionDialogProps) {
  const initialFormData: Omit<UserPermission, "id"> = {
    userName: "",
    userEmail: "",
    userId: "",
    agent: agents.find((agent) => agent.name.trim() !== "")?.name || "",
    catchup: "daily",
    scope: "Browser Web", // Default to new scope value
  }

  const [formData, setFormData] = useState<Omit<UserPermission, "id"> & { id?: string }>(permission || initialFormData)

  useEffect(() => {
    if (mode === "edit" && permission) {
      setFormData(permission)
    } else if (mode === "create") {
      setFormData({
        ...initialFormData,
        userId: "",
        agent: agents.find((agent) => agent.name.trim() !== "")?.name || "",
      })
    }
  }, [permission, mode, agents])

  const handleInputChange = (field: keyof Omit<UserPermission, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    const submissionData: UserPermission = {
      id: formData.id || Date.now().toString(),
      userName: formData.userName,
      userEmail: formData.userEmail,
      userId: mode === "create" ? formData.userId || `U-NEW-${Date.now().toString().slice(-4)}` : formData.userId,
      agent: formData.agent,
      catchup: formData.catchup,
      scope: formData.scope as UserPermission["scope"], // Ensure type correctness
    }
    onSave(submissionData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit User Permission" : "Create User Permission"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the user permission details."
              : "Fill in the details for the new user permission."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => handleInputChange("userName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userEmail">User Email</Label>
            <Input
              id="userEmail"
              type="email"
              value={formData.userEmail}
              onChange={(e) => handleInputChange("userEmail", e.target.value)}
            />
          </div>
          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => handleInputChange("userId", e.target.value)}
                disabled // User ID is not editable after creation in this mock
              />
            </div>
          )}
          {mode === "create" && (
            <div className="space-y-2">
              <Label htmlFor="userId">User ID (Optional)</Label>
              <Input
                id="userId"
                value={formData.userId}
                onChange={(e) => handleInputChange("userId", e.target.value)}
                placeholder="Auto-generated if empty"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="agent">Agent</Label>
            <Select value={formData.agent} onValueChange={(value) => handleInputChange("agent", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents
                  .filter((agent) => agent.name.trim() !== "")
                  .map((agent) => (
                    <SelectItem key={agent.id} value={agent.name}>
                      {agent.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="catchup">Catchup</Label>
            <Select value={formData.catchup} onValueChange={(value) => handleInputChange("catchup", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select catchup type" />
              </SelectTrigger>
              <SelectContent>
                {catchupOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scope">Scope</Label>
            <Select
              value={formData.scope}
              onValueChange={(value) => handleInputChange("scope", value as UserPermission["scope"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                {scopeOptions.map(
                  (
                    opt, // Using updated scopeOptions
                  ) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{mode === "edit" ? "Save Changes" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
