"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

const SIDEBAR_MENU_STATE_KEY = "sidebar_menu_state"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  // State to track which menus are open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  // Load saved menu state from localStorage on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(SIDEBAR_MENU_STATE_KEY)
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        setOpenMenus(parsedState)
      } else {
        // Initialize with default states (isActive items)
        const defaultState: Record<string, boolean> = {}
        items.forEach(item => {
          defaultState[item.title] = item.isActive || false
        })
        setOpenMenus(defaultState)
      }
    } catch (error) {
      console.error("Failed to load sidebar menu state:", error)
      // Fallback to default states
      const defaultState: Record<string, boolean> = {}
      items.forEach(item => {
        defaultState[item.title] = item.isActive || false
      })
      setOpenMenus(defaultState)
    }
  }, [items])

  // Save menu state to localStorage whenever it changes
  const handleMenuToggle = (menuTitle: string, isOpen: boolean) => {
    const newState = { ...openMenus, [menuTitle]: isOpen }
    setOpenMenus(newState)

    try {
      localStorage.setItem(SIDEBAR_MENU_STATE_KEY, JSON.stringify(newState))
    } catch (error) {
      console.error("Failed to save sidebar menu state:", error)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openMenus[item.title]}
            onOpenChange={(isOpen) => handleMenuToggle(item.title, isOpen)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
