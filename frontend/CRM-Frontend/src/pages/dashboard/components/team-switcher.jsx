"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({ teams = [] }) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])
  const userRole = (localStorage.getItem('role') || 'user').toLowerCase();

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* Main button styled for the dark teal sidebar palette */}
          <DropdownMenuTrigger asChild disabled={userRole !== 'admin'}>
            <SidebarMenuButton
              size="lg"
              className={`
                w-full transition-all duration-200 px-3 py-6 rounded-xl flex items-center gap-3 text-white 
                ${userRole === 'admin' ? 'hover:!bg-[#006666] data-[state=open]:!bg-[#006666]' : 'cursor-default'}
              `}
            >
              {/* Dynamic Logo Box with deep-teal contrast fill */}
              <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-[#006666] border border-[#008080] text-[#b2d8d8]">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">{activeTeam.name}</span>
                <span className="truncate text-xs text-[#b2d8d8] font-medium">{activeTeam.plan}</span>
              </div>
              {/* Chevron element mapped to our palette */}
              {userRole === 'admin' && <ChevronsUpDown className="ml-auto size-4 text-[#66b2b2]" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/*  Dropdown Menu Box: Styled using the Light Panel Dashboard Theme */}
          {userRole === 'admin' && (
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl bg-white border border-slate-100 shadow-xl p-1.5 text-slate-700 animate-in fade-in-50 slide-in-from-top-1"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs font-semibold tracking-wider text-[#66b2b2] uppercase px-2.5 py-1.5">
                Teams
              </DropdownMenuLabel>
              
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-[#004c4c] font-medium hover:bg-slate-50 focus:bg-slate-50 focus:text-[#004c4c] cursor-pointer transition-colors"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-[#008080]">
                    <team.logo className="size-3.5 shrink-0" />
                  </div>
                  <span className="flex-1 truncate">{team.name}</span>
                  <DropdownMenuShortcut className="text-slate-400 font-normal text-xs pl-2">
                    ⌘{index + 1}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator className="bg-slate-100 my-1" />
              
              {/* Add Team interactive element */}
              <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold text-[#008080] hover:bg-slate-50 focus:bg-slate-50 focus:text-[#008080] cursor-pointer transition-colors">
                <div className="flex size-6 items-center justify-center rounded-md border border-dashed border-[#66b2b2] bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div>Add team</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}