"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar" // Removed SidebarTrigger
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import type { Agent } from "./dashboard-view"

export type NavigationItem = "dashboard" | "channel-permissions" | "user-permissions" | "user-management"

const mockAgentsList: Agent[] = [
  {
    id: "1",
    name: "GoTeddy",
    description: "Automated customer support agent.",
    status: "active",
    iconName: "Bot",
  },
  {
    id: "2",
    name: "DataCruncher",
    description: "Analyzes large datasets for insights.",
    status: "active",
    iconName: "Cpu",
  },
  {
    id: "3",
    name: "LeadGenius",
    description: "Identifies and qualifies sales leads.",
    status: "inactive",
    iconName: "Zap",
  },
  {
    id: "4",
    name: "ContentSpark",
    description: "Generates creative content ideas.",
    status: "active",
    iconName: "Brain",
  },
  {
    id: "5",
    name: "CodeHelper",
    description: "Assists developers with code snippets.",
    status: "error",
    iconName: "Bot",
  },
]

export function DashboardLayout() {
  const [activeItem, setActiveItem] = useState<NavigationItem>("dashboard")

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar activeItem={activeItem} onItemSelect={setActiveItem} />
      <SidebarInset>
        {/* Header removed */}
        <main className="flex-1">
          <DashboardContent activeItem={activeItem} agents={mockAgentsList} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
