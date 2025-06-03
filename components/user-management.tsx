"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, UserPlus, Edit2, XCircle, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer"
  status: "active" | "inactive" | "pending"
  lastLogin: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Admin",
    status: "active",
    lastLogin: "2024-01-15 10:30 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Editor",
    status: "active",
    lastLogin: "2024-01-14 3:45 PM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    role: "Viewer",
    status: "inactive",
    lastLogin: "2024-01-10 9:15 AM",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "Editor",
    status: "pending",
    lastLogin: "Never",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const roleOptions: User["role"][] = ["Admin", "Editor", "Viewer"]
const statusOptions: User["status"][] = ["active", "inactive", "pending"]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<"edit" | "create">("edit")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [users, searchTerm])

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-yellow-300 text-yellow-800 dark:border-yellow-700 dark:text-yellow-300"
          >
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge variant="destructive">Admin</Badge>
      case "Editor":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Editor
          </Badge>
        )
      case "Viewer":
        return <Badge variant="outline">Viewer</Badge>
      default:
        return <Badge variant="secondary">{role}</Badge>
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setDialogMode("create")
    setDialogOpen(true)
  }

  const handleSaveUser = (userToSave: User) => {
    if (dialogMode === "edit" && editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? userToSave : u)))
    } else {
      setUsers((prev) => [...prev, { ...userToSave, id: Date.now().toString(), lastLogin: "Never" }])
    }
    setDialogOpen(false)
  }

  const handleDeactivateUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "inactive" } : u)))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Name or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:w-[250px] lg:w-[300px]"
          />
        </div>
        <Button onClick={handleAddUser} className="w-full sm:w-auto">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeactivateUser(user.id)}
                        className="text-destructive"
                        disabled={user.status === "inactive"}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSave={handleSaveUser}
        mode={dialogMode}
      />
    </div>
  )
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSave: (user: User) => void
  mode: "edit" | "create"
}

function UserDialog({ open, onOpenChange, user, onSave, mode }: UserDialogProps) {
  const [formData, setFormData] = useState<User>(
    user || {
      id: "",
      name: "",
      email: "",
      role: "Viewer",
      status: "pending",
      lastLogin: "Never",
    },
  )

  useState(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        role: "Viewer",
        status: "pending",
        lastLogin: "Never",
      })
    }
  }, [user, mode])

  const handleInputChange = (field: keyof Omit<User, "id" | "lastLogin" | "avatar">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Update user details." : "Fill in the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value as User["role"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value as User["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt} value={opt} className="capitalize">
                    {opt}
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
          <Button onClick={handleSubmit}>{mode === "edit" ? "Save Changes" : "Add User"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
