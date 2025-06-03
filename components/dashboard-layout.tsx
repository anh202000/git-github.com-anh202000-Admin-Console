"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardContent } from "@/components/dashboard-content";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"; // Removed SidebarTrigger
import { useState } from "react";
import type { Agent } from "./dashboard-view";

export type NavigationItem = "dashboard" | "channel-permissions" | "user-permissions" | "user-management" | "web-dashboard" | "web-user-permissions"

const mockAgentsList: Agent[] = [
  {
    id: "1",
    name: "GoTeddy",
    description: "Your AI companion that transforms how teams work by automating routine tasks and providing instant access to critical organizational knowledge.",
    status: "active",
    iconName: "Bot",
  },
]

const mockWebAgentsList: Agent[] = [
  {
    id: "1",
    name: "Visual UI Testing",
    description: "Ensure pixel-perfect user interfaces with AI that automatically detects visual inconsistencies and suggests improvements.",
    status: "active",
    iconName: "Bot",
  },
  {
    id: "2",
    name: "Custom Tymee Assistant",
    description: "Empower your team to create, customize, and deploy AI assistants tailored to specific workflows—no coding required.",
    status: "active",
    iconName: "Bot",
  },
  {
    id: "3",
    name: "Tymee Crystal",
    description: "Supercharge your development workflow with AI-powered coding assistance that understands context and accelerates delivery.",
    status: "active",
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
          <DashboardContent activeItem={activeItem} agents={mockAgentsList} webAgents={mockWebAgentsList}/>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
