"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Brain, Cpu, Zap, type LucideIcon } from "lucide-react"

// Define Agent type here or import from a shared types file
export interface Agent {
  id: string
  name: string
  description: string
  status: "active" | "inactive" | "error"
  iconName: string // Store icon name as string
}

interface DashboardViewProps {
  agents: Agent[] // Receive agents as a prop
}

const iconComponents: Record<string, LucideIcon> = {
  Bot,
  Cpu,
  Zap,
  Brain,
}

export function WebDashboardView({ agents }: DashboardViewProps) {
  const getStatusColor = (status: Agent["status"]) => {
    if (status === "active") return "bg-green-500"
    if (status === "inactive") return "bg-yellow-500"
    if (status === "error") return "bg-red-500"
    return "bg-gray-500"
  }

  return (
    <div className="p-6">
      <CardHeader className="px-0">
        <CardTitle>Slack AI Agents Dashboard</CardTitle>
        <CardDescription>Overview of your AI Agent bots.</CardDescription>
      </CardHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const IconComponent = iconComponents[agent.iconName] || Bot
          return (
            <Card key={agent.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{agent.name}</CardTitle>
                <IconComponent className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </CardContent>
              <div className="border-t px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${getStatusColor(agent.status)}`}
                      aria-label={agent.status}
                    />
                    <span className="text-xs capitalize">{agent.status}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
