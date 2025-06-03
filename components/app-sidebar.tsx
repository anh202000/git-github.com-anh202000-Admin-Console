"use client"

import {
  LayoutDashboard,
  Users,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  UsersRound,
  MessageCircle,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

interface AppSidebarProps {
  activeItem: string
  onItemSelect: (item: string) => void
}

export function AppSidebar({ activeItem, onItemSelect }: AppSidebarProps) {
  const { user, logout } = useAuth()
  const [isPermissionManagementOpen, setIsPermissionManagementOpen] = useState(true)
  const [isSlackSubMenuOpen, setIsSlackSubMenuOpen] = useState(true) // State for Slack submenu
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const sidebarContext = useSidebar()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted || !sidebarContext) {
    return null
  }

  const { state: sidebarState, isMobile } = sidebarContext

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-semibold">TymexAI</h1>
            <p className="text-xs text-muted-foreground">Admin Console</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Permission Management Top Level */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setIsPermissionManagementOpen(!isPermissionManagementOpen)}
                  className="w-full justify-between"
                  tooltip={{
                    children: "Permission Management",
                    hidden: sidebarState !== "collapsed" || isMobile,
                  }}
                >
                  <div className="flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    <span>Permission Management</span>
                  </div>
                  <span className="group-data-[collapsible=icon]:hidden">
                    {isPermissionManagementOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                </SidebarMenuButton>

                {isPermissionManagementOpen && (
                  <SidebarMenuSub>
                    {/* Slack Sub-Menu */}
                    <SidebarMenuSubItem>
                      <SidebarMenuButton
                        onClick={() => setIsSlackSubMenuOpen(!isSlackSubMenuOpen)}
                        className="w-full justify-between pl-4 pr-2 text-sm" // Indent and adjust padding
                        tooltip={{
                          children: "Slack",
                          hidden: sidebarState !== "collapsed" || isMobile,
                        }}
                      >
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-2" /> {/* Slack Icon */}
                          <span>Slack</span>
                        </div>
                        <span className="group-data-[collapsible=icon]:hidden">
                          {isSlackSubMenuOpen ? (
                            <ChevronDown className="h-3 w-3" /> // Smaller chevron
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </span>
                      </SidebarMenuButton>
                      {isSlackSubMenuOpen && (
                        <SidebarMenuSub className="pl-4">
                          {" "}
                          {/* Further indent sub-items */}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              onClick={() => onItemSelect("dashboard")}
                              isActive={activeItem === "dashboard"}
                              className="text-xs" // Smaller text for deeper items
                            >
                              <LayoutDashboard className="h-3 w-3 mr-2" />
                              <span>Dashboard</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              onClick={() => onItemSelect("channel-permissions")}
                              isActive={activeItem === "channel-permissions"}
                              className="text-xs"
                            >
                              <MessageCircle className="h-3 w-3 mr-2" />
                              <span>Channel Permissions</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              onClick={() => onItemSelect("user-permissions")}
                              isActive={activeItem === "user-permissions"}
                              className="text-xs"
                            >
                              <UsersRound className="h-3 w-3 mr-2" />
                              <span>User Permissions</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* User Management Top Level */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onItemSelect("user-management")}
                  isActive={activeItem === "user-management"}
                  tooltip={{
                    children: "User Management",
                    hidden: sidebarState !== "collapsed" || isMobile,
                  }}
                >
                  <Users className="h-4 w-4" />
                  <span>User Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between mb-3 group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-medium">Theme</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        <div className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User Avatar"} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="group-data-[collapsible=icon]:flex hidden flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-full justify-center"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={logout} className="w-full justify-center" aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
