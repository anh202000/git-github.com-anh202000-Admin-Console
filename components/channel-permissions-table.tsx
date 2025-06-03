"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Plus, MoreHorizontal, Trash2, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Agent } from "./dashboard-view"

interface ChannelPermission {
  id: string
  channelName: string
  channelId: string
  agent: string
  catchup: string
  scope: "custom" | "allowed" | "not_allowed"
}

const mockChannelData: ChannelPermission[] = [
  {
    id: "1",
    channelName: "#general",
    channelId: "C012AB3CD",
    agent: "GoTeddy",
    catchup: "daily",
    scope: "allowed",
  },
  {
    id: "2",
    channelName: "#dev-team",
    channelId: "C023BC4DE",
    agent: "CodeHelper",
    catchup: "real-time",
    scope: "custom",
  },
  {
    id: "3",
    channelName: "#marketing-updates",
    channelId: "C034CD5EF",
    agent: "LeadGenius",
    catchup: "weekly",
    scope: "not_allowed",
  },
  {
    id: "4",
    channelName: "#support-tickets",
    channelId: "C045DE6FG",
    agent: "DataCruncher",
    catchup: "hourly",
    scope: "allowed",
  },
]

const scopeOptions = [
  { value: "custom", label: "Custom" },
  { value: "allowed", label: "Allowed" },
  { value: "not_allowed", label: "Not Allowed" },
]

const ALL_AGENTS_VALUE = "__ALL_AGENTS__" // Define a constant for "All Agents"

interface ChannelPermissionsTableProps {
  agents: Agent[]
}

export function ChannelPermissionsTable({ agents }: ChannelPermissionsTableProps) {
  const [data, setData] = useState<ChannelPermission[]>(mockChannelData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<ChannelPermission | null>(null)
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit")
  const [selectedAgent, setSelectedAgent] = useState<string>(ALL_AGENTS_VALUE) // Default to all agents
  const [searchTermChannel, setSearchTermChannel] = useState("")

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        (selectedAgent === ALL_AGENTS_VALUE || item.agent === selectedAgent) &&
        item.channelName.toLowerCase().includes(searchTermChannel.toLowerCase()),
    )
  }, [data, selectedAgent, searchTermChannel])

  const handleEdit = (permission: ChannelPermission) => {
    setEditingPermission(permission)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingPermission(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = (permissionToSave: ChannelPermission) => {
    if (dialogMode === "edit" && editingPermission) {
      setData((prev) => prev.map((item) => (item.id === editingPermission.id ? permissionToSave : item)))
    } else {
      setData((prev) => [...prev, { ...permissionToSave, id: Date.now().toString() }])
    }
    setDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
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
              placeholder="Search by Channel..."
              value={searchTermChannel}
              onChange={(e) => setSearchTermChannel(e.target.value)}
              className="pl-8 sm:w-[200px] lg:w-[250px]"
            />
          </div>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Channel Permission
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel Name</TableHead>
              <TableHead>Channel ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Catchup</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.channelName}</TableCell>
                <TableCell>{item.channelId}</TableCell>
                <TableCell>{item.agent}</TableCell>
                <TableCell>{item.catchup}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium
                                      ${item.scope === "allowed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                                      ${item.scope === "not_allowed" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : ""}
                                      ${item.scope === "custom" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : ""}`}
                  >
                    {scopeOptions.find((s) => s.value === item.scope)?.label}
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
      <ChannelPermissionDialog
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

interface ChannelPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  permission: ChannelPermission | null
  onSave: (permission: ChannelPermission) => void
  mode: "edit" | "create"
  agents: Agent[]
}

function ChannelPermissionDialog({
  open,
  onOpenChange,
  permission,
  onSave,
  mode,
  agents,
}: ChannelPermissionDialogProps) {
  const [formData, setFormData] = useState<ChannelPermission>(
    permission || {
      id: "",
      channelName: "",
      channelId: "",
      agent: agents.find((agent) => agent.name.trim() !== "")?.name || "", // Default to first valid agent or empty
      catchup: "daily",
      scope: "allowed",
    },
  )

  // Effect to update formData when permission or mode changes
  useState(() => {
    if (mode === "edit" && permission) {
      setFormData(permission)
    } else if (mode === "create") {
      setFormData({
        id: "",
        channelName: "",
        channelId: "",
        agent: agents.find((agent) => agent.name.trim() !== "")?.name || "",
        catchup: "daily",
        scope: "allowed",
      })
    }
  }, [permission, mode, agents])

  const handleInputChange = (field: keyof ChannelPermission, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Channel Permission" : "Create Channel Permission"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the Slack channel permission details."
              : "Fill in the details for the new Slack channel permission."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="channelName">Channel Name</Label>
            <Input
              id="channelName"
              value={formData.channelName}
              onChange={(e) => handleInputChange("channelName", e.target.value)}
              placeholder="#example-channel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channelId">Channel ID</Label>
            <Input
              id="channelId"
              value={formData.channelId}
              onChange={(e) => handleInputChange("channelId", e.target.value)}
              placeholder="C012AB3CD"
            />
          </div>
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-time">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scope">Scope</Label>
            <Select
              value={formData.scope}
              onValueChange={(value) => handleInputChange("scope", value as ChannelPermission["scope"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                {scopeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
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
