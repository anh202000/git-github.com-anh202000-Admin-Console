"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import { EditPermissionDialog } from "@/components/edit-permission-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"

interface WebPermission {
  id: string
  user: string
  userId: string
  teamId: string
  tool: string
  channel: string
  catchup: string
  scope: string
}

const mockWebData: WebPermission[] = [
  {
    id: "1",
    user: "admin.user",
    userId: "W123456",
    teamId: "WT789012",
    tool: "web-dashboard",
    channel: "main-app",
    catchup: "real-time",
    scope: "admin",
  },
  {
    id: "2",
    user: "viewer.user",
    userId: "W234567",
    teamId: "WT789012",
    tool: "web-analytics",
    channel: "analytics-portal",
    catchup: "hourly",
    scope: "read-only",
  },
  {
    id: "3",
    user: "editor.user",
    userId: "W345678",
    teamId: "WT890123",
    tool: "web-cms",
    channel: "content-management",
    catchup: "daily",
    scope: "read-write",
  },
  {
    id: "4",
    user: "api.user",
    userId: "W456789",
    teamId: "WT890123",
    tool: "web-api",
    channel: "api-gateway",
    catchup: "real-time",
    scope: "api-access",
  },
]

export function WebPermissionsTable() {
  const [data, setData] = useState<WebPermission[]>(mockWebData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<WebPermission | null>(null)
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit")

  const handleEdit = (permission: WebPermission) => {
    setEditingPermission(permission)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingPermission(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSave = (permission: WebPermission) => {
    if (dialogMode === "edit") {
      setData((prev) => prev.map((item) => (item.id === permission.id ? permission : item)))
    } else {
      setData((prev) => [...prev, permission])
    }
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Web Permissions</h2>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(item.id)}>
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
      <EditPermissionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        permission={editingPermission}
        mode={dialogMode}
        onSave={handleSave}
      />
    </div>
  )
}
