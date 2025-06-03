"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2, Check, X, Plus, MoreHorizontal, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditPermissionDialog } from "@/components/edit-permission-dialog"

interface SlackPermission {
  id: string
  user: string
  userId: string
  teamId: string
  tool: string
  channel: string
  catchup: string
  scope: string
}

const mockSlackData: SlackPermission[] = [
  {
    id: "1",
    user: "john.doe",
    userId: "U123456",
    teamId: "T789012",
    tool: "slack-bot",
    channel: "#general",
    catchup: "daily",
    scope: "read-write",
  },
  {
    id: "2",
    user: "jane.smith",
    userId: "U234567",
    teamId: "T789012",
    tool: "slack-integration",
    channel: "#dev-team",
    catchup: "weekly",
    scope: "read-only",
  },
  {
    id: "3",
    user: "mike.johnson",
    userId: "U345678",
    teamId: "T890123",
    tool: "slack-bot",
    channel: "#marketing",
    catchup: "daily",
    scope: "admin",
  },
  {
    id: "4",
    user: "sarah.wilson",
    userId: "U456789",
    teamId: "T890123",
    tool: "slack-analytics",
    channel: "#analytics",
    catchup: "monthly",
    scope: "read-write",
  },
]

export function SlackPermissionsTable() {
  const [data, setData] = useState<SlackPermission[]>(mockSlackData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<SlackPermission | null>(null)
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit")

  const startEdit = (id: string, currentScope: string) => {
    setEditingId(id)
    setEditValue(currentScope)
  }

  const saveEdit = (id: string) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, scope: editValue } : item)))
    setEditingId(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  const handleEdit = (permission: SlackPermission) => {
    setEditingPermission(permission)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingPermission(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = (permission: SlackPermission) => {
    if (dialogMode === "edit") {
      setData((prev) => prev.map((item) => (item.id === permission.id ? permission : item)))
    } else {
      setData((prev) => [...prev, permission])
    }
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Slack Permissions</h3>
          <p className="text-sm text-muted-foreground">Manage Slack channel permissions and access controls</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Permission
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Team ID</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Catchup</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.user}</TableCell>
                <TableCell>{item.userId}</TableCell>
                <TableCell>{item.teamId}</TableCell>
                <TableCell>{item.tool}</TableCell>
                <TableCell>{item.channel}</TableCell>
                <TableCell>{item.catchup}</TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-32"
                      autoFocus
                    />
                  ) : (
                    <span className="px-2 py-1 bg-secondary rounded text-sm">{item.scope}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === item.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => saveEdit(item.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
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
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <EditPermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permission={editingPermission}
        onSave={handleSave}
        mode={dialogMode}
      />
    </div>
  )
}
