"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import type { Agent } from "./dashboard-view" // Import Agent type

export type NavigationItem = "dashboard" | "channel-permissions" | "user-permissions" | "user-management"

// Define mockAgents here to be passed down
const mockAgentsList: Agent[] = [
  {
    id: "1",
    name: "GoTeddy",
    description: "Automated customer support agent.",
    status: "active",
    iconName: "Bot", // Store icon name as string
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">TymexAI Admin Console</h1>
          </div>
        </header>
        <main className="flex-1">
          {/* Pass mockAgentsList to DashboardContent */}
          <DashboardContent activeItem={activeItem} agents={mockAgentsList} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
