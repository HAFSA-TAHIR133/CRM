"use client";

import { useLocation, Link } from "react-router-dom"; // Assuming you use react-router-dom for navigation
import { ChevronRight } from "lucide-react";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items = [] }) {
  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();
  const location = useLocation(); // Hook to determine which route is active

  return (
    <SidebarGroup>
      {/* Group Label matching the dark sidebar theme */}
      <SidebarGroupLabel className="text-[#66b2b2] text-xs font-semibold tracking-wider uppercase px-2 mb-2">
        Platform
      </SidebarGroupLabel>
      
      <SidebarMenu className="gap-1">
        {items
          .filter((item) => !item.adminOnly || userRole === 'admin')
          .map((item) => {
            // Check if any of its sub-items match the current active path
            const hasActiveChild = item.items?.some((sub) => location.pathname === sub.url);
            
            return (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive || hasActiveChild}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      className={`
                        w-full transition-all duration-200 px-3 py-5 rounded-lg flex items-center gap-3 font-medium group
                        /* Hover and base text configuration */
                        text-[#b2d8d8] hover:!bg-[#006666] hover:!text-white data-[state=open]:!text-white
                      `}
                    >
                      {item.icon && <item.icon className="w-5 h-5 text-[#66b2b2] group-hover:text-white" />}
                      <span className="text-[14px]">{item.title}</span>
                      
                      {/* Chevron matching your style and rotating smoothly when open */}
                      <ChevronRight className="ml-auto w-4 h-4 text-[#66b2b2] transition-transform duration-200 group-data-[state=open]:rotate-90 group-hover:text-white" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    {/* Nested Sub-Menu Area with a subtle left border to visually organize items */}
                    <SidebarMenuSub className="border-l border-[#006666] ml-5 pl-2 mt-1 gap-1">
                      {item.items?.map((subItem) => {
                        if (subItem.adminOnly && userRole !== 'admin') return null;
                        
                        const isSubActive = location.pathname === subItem.url;

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild 
                              isActive={isSubActive}
                              className={`
                                w-full transition-all duration-150 px-3 py-4 rounded-md text-[13px] font-medium
                                /* Active sub-link mimics the image active state, inactive gets clear hover states */
                                ${isSubActive 
                                  ? '!bg-[#008080] !text-white font-semibold' 
                                  : 'text-[#b2d8d8] hover:!bg-[#006666]/50 hover:!text-white'
                                }
                              `}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
      </SidebarMenu>
    </SidebarGroup>
  );
}