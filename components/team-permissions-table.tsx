"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import { Search, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Agent {
  id: string
  name: string
}

interface ChannelPermission {
  id: string
  channelName: string
  channelId: string
  agent: string
  catchup: "daily" | "weekly" | "monthly"
  scope: "allowed" | "not_allowed"
}

const mockChannelData: ChannelPermission[] = [
  {
    id: "1",
    channelName: "#general",
    channelId: "C012AB3CD",
    agent: "CodeHelper",
    catchup: "daily",
    scope: "allowed",
  },
  {
    id: "2",
    channelName: "#random",
    channelId: "C034EF5GH",
    agent: "CodeHelper",
    catchup: "weekly",
    scope: "not_allowed",
  },
  {
    id: "3",
    channelName: "#announcements",
    channelId: "C056IJ7KL",
    agent: "CodeHelper",
    catchup: "monthly",
    scope: "allowed",
  },
  {
    id: "4",
    channelName: "#dev-chat",
    channelId: "C078MN9OP",
    agent: "CodeHelper",
    catchup: "daily",
    scope: "allowed",
  },
  {
    id: "5",
    channelName: "#random",
    channelId: "C056EF7GH",
    agent: "CodeHelper",
    catchup: "weekly",
    scope: "not_allowed",
  },
]

const scopeOptions = [
  { value: "allowed", label: "Allowed" },
  { value: "not_allowed", label: "Not Allowed" },
]

interface ChannelPermissionsTableProps {
  agents: Agent[] // Receive agents list as a prop
}

export function ChannelPermissionsTable({ agents }: ChannelPermissionsTableProps) {
  const [data, setData] = useState<ChannelPermission[]>(mockChannelData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<ChannelPermission | null>(null)
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit")
  const [searchTermAgent, setSearchTermAgent] = useState("")
  const [searchTermChannel, setSearchTermChannel] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("")

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.agent.toLowerCase().includes(searchTermAgent.toLowerCase()) &&
        item.channelName.toLowerCase().includes(searchTermChannel.toLowerCase()) &&
        (!selectedAgent || item.agent === selectedAgent),
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
      setData((prev) => [...prev, { ...permissionToSave, id: String(Date.now()) }])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by agent..."
            value={searchTermAgent}
            onChange={(e) => setSearchTermAgent(e.target.value)}
            className="pl-8 sm:w-[200px] lg:w-[250px]"
          />
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="sm:w-[200px] lg:w-[250px]">
              <SelectValue placeholder="Filter by Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Agents</SelectItem>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.name}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Channel Permission
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableCaption>Channel permission management.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Channel Name</TableHead>
              <TableHead>Channel ID</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Catchup</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.channelName}</TableCell>
                <TableCell>{permission.channelId}</TableCell>
                <TableCell>{permission.agent}</TableCell>
                <TableCell>{permission.catchup}</TableCell>
                <TableCell>{permission.scope}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(permission)}>
                    Edit
                  </Button>
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
  agents: Agent[] // Receive agents for dropdown
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
      agent: agents[0]?.name || "", // Default to first agent or empty
      catchup: "daily",
      scope: "allowed",
    },
  )

  useMemo(() => {
    if (permission) {
      // When editing, populate form with existing permission data
      setFormData(permission)
    } else {
      // Reset for create mode
      setFormData({
        id: "",
        channelName: "",
        channelId: "",
        agent: "",
        catchup: "daily",
        scope: "allowed",
      })
    }
  }, [permission, mode])

  const handleInputChange = (field: keyof ChannelPermission, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave({ ...formData, id: formData.id || String(Date.now()) })
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
            <Input id="agent" value={formData.agent} onChange={(e) => handleInputChange("agent", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="catchup">Catchup</Label>
            <Select
              value={formData.catchup}
              onValueChange={(value) => handleInputChange("catchup", value as ChannelPermission["catchup"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scopeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {mode === "edit" ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
