"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithMicrosoft: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("tymexai-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Mock login - in real app, this would call your auth API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: email,
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setUser(mockUser)
    localStorage.setItem("tymexai-user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const loginWithMicrosoft = async () => {
    setIsLoading(true)
    // Mock Microsoft OAuth - in real app, this would redirect to Microsoft
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const mockUser: User = {
      id: "1",
      name: "John Smith",
      email: "john.smith@company.com",
      avatar: "/placeholder.svg?height=32&width=32",
    }

    setUser(mockUser)
    localStorage.setItem("tymexai-user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("tymexai-user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithMicrosoft, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
