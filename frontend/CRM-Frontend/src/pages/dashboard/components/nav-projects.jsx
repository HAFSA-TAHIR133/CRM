"use client"

import { useLocation, Link } from "react-router-dom"; // Assuming React Router for standard navigation
import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({ projects = [] }) {
  const { isMobile } = useSidebar()
  const location = useLocation()
  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* Group Title matching the theme */}
      <SidebarGroupLabel className="text-[#66b2b2] text-xs font-semibold tracking-wider uppercase px-2 mb-2">
        Projects
      </SidebarGroupLabel>
      
      <SidebarMenu className="gap-1">
        {projects
          .filter((item) => !item.adminOnly || userRole === 'admin')
          .map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <SidebarMenuItem key={item.name} className="relative group/item">
                <SidebarMenuButton 
                  asChild
                  isActive={isActive}
                  className={`
                    w-full transition-all duration-200 px-3 py-5 rounded-lg flex items-center gap-3 font-medium group
                    /* Active vs Inactive state mapping */
                    ${isActive 
                      ? '!bg-[#008080] !text-white' 
                      : 'text-[#b2d8d8] hover:!bg-[#006666] hover:!text-white'
                    }
                  `}
                >
                  <Link to={item.url}>
                    {item.icon && (
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#66b2b2] group-hover:text-white'}`} />
                    )}
                    <span className="text-[14px]">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                
                {/*  Context Action Ellipsis Icon */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction 
                      showOnHover
                      className="text-[#66b2b2] hover:text-white hover:!bg-[#008080]/50 data-[state=open]:text-white transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  
                  {/* Dropdown Box: Styled using the Light UI Theme matching the inner dashboard panels */}
                  <DropdownMenuContent
                    className="w-48 rounded-xl bg-white border border-slate-100 shadow-xl p-1 text-slate-700 animate-in fade-in-50 slide-in-from-top-1"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    {/* View Item */}
                    <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#004c4c] hover:bg-slate-50 cursor-pointer transition-colors focus:bg-slate-50 focus:text-[#004c4c]">
                      <Folder className="w-4 h-4 text-[#66b2b2]" />
                      <span>View Project</span>
                    </DropdownMenuItem>

                    {/* Admin Share */}
                    {userRole === 'admin' && (
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#004c4c] hover:bg-slate-50 cursor-pointer transition-colors focus:bg-slate-50 focus:text-[#004c4c]">
                        <Forward className="w-4 h-4 text-[#66b2b2]" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                    )}
                    
                    {/* Admin Delete Action */}
                    {userRole === 'admin' && (
                      <>
                        <DropdownMenuSeparator className="bg-slate-100 my-1" />
                        <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700 cursor-pointer transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })}
          
        {/* Bottom Static "More" trigger element */}
        <SidebarMenuItem>
          <SidebarMenuButton className="w-full text-[#b2d8d8]/70 hover:text-white hover:!bg-[#006666] px-3 py-5 rounded-lg flex items-center gap-3 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-[#66b2b2]/70 group-hover:text-white" />
            <span className="text-[14px]">More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}