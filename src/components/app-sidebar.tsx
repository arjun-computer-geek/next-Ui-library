import { Calendar, Home, Inbox, Search, Settings, LayoutDashboard, Folder, LifeBuoy, PlusCircle } from "lucide-react"
import Link from 'next/link';

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

} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserDropdown } from "./user-dropdown";

const applicationItems = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Demo",
        url: "/demo",
        icon: LayoutDashboard,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        label: "128",
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Search",
        url: "#",
        icon: Search,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
]

const projectItems = [
    {
        title: "GraphQL API",
        url: "#",
        icon: Folder,
    },
    {
        title: "iOS App",
        url: "#",
        icon: Folder,
    },
    {
        title: "Website",
        url: "#",
        icon: Folder,
    },
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src="https://github.com/acme.png" alt="Acme Inc." />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <span className="font-medium group-data-[collapsible=icon]:hidden">Acme Inc.</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="start">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {applicationItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon className="w-4 h-4" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                            {item.label && <span className="ml-auto text-xs group-data-[collapsible=icon]:hidden">{item.label}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                        <span className="group-data-[collapsible=icon]:hidden">Projects</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            <PlusCircle className="w-4 h-4" />
                        </Button>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projectItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon className="w-4 h-4" />
                                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-2">
                <UserDropdown />
            </SidebarFooter>
        </Sidebar>
    )
}