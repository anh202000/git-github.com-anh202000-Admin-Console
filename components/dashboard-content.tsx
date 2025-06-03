"use client"

import { DashboardView, type Agent } from "@/components/dashboard-view" // Import Agent type
import { ChannelPermissionsTable } from "@/components/channel-permissions-table"
import { UserPermissionsTable } from "@/components/user-permissions-table"
import { UserManagement } from "@/components/user-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { NavigationItem } from "./dashboard-layout"

interface DashboardContentProps {
  activeItem: NavigationItem
  agents: Agent[] // Receive agents list
}

export function DashboardContent({ activeItem, agents }: DashboardContentProps) {
  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <DashboardView agents={agents} /> // Pass agents to DashboardView
      case "channel-permissions":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>Channel Permissions</CardTitle>
                <CardDescription>Manage Slack channel access to AI agents.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChannelPermissionsTable agents={agents} /> {/* Pass agents */}
              </CardContent>
            </Card>
          </div>
        )
      case "user-permissions":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>User Permissions</CardTitle>
                <CardDescription>Manage individual user access to AI agents.</CardDescription>
              </CardHeader>
              <CardContent>
                <UserPermissionsTable agents={agents} /> {/* Pass agents */}
              </CardContent>
            </Card>
          </div>
        )
      case "user-management":
        return (
          <div className="p-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users, roles, and overall status.</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </div>
        )
      default:
        // This case should ideally not be reached if activeItem is always valid
        // For safety, you could redirect to dashboard or show a specific message
        return <DashboardView agents={agents} /> // Default to dashboard view
    }
  }

  return <>{renderContent()}</>
}
