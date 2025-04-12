"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, UserCog } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/",
    icon: BarChart3,
  },
  {
    title: "Admin Management",
    href: "/admins",
    icon: UserCog,
  },
]

interface DashboardNavProps {
  collapsed?: boolean
  onNavItemClick?: () => void
}

export function DashboardNav({ collapsed = false, onNavItemClick }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavClick = (href: string) => {
    if (onNavItemClick) {
      onNavItemClick()
    }
    router.push(href)
  }

  return (
    <nav className="grid items-start px-2 text-sm font-medium">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => handleNavClick(item.href)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground text-left",
            pathname === item.href && "bg-muted text-foreground",
            collapsed ? "justify-center" : "",
          )}
        >
          <item.icon className="h-4 w-4" />
          {!collapsed && <span>{item.title}</span>}
        </button>
      ))}
    </nav>
  )
}
