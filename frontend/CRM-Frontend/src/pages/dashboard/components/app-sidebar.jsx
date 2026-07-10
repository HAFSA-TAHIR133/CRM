import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/authContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Home, Users, BarChart3, CheckSquare, Settings, UserCog } from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, adminOnly: false },
  { title: "Leads", url: "/leads", icon: Users, adminOnly: false },
  { title: "Tasks", url: "/tasks", icon: CheckSquare, adminOnly: false },
  // { title: "Pipeline Board", url: "/pipeline", icon: BarChart3, adminOnly: false },
  { title: "Pipelines", url: "/pipelines", icon: BarChart3, adminOnly: true },
  { title: "Team", url: "/users", icon: UserCog, adminOnly: true },
  { title: "Settings", url: "/settings", icon: Settings, adminOnly: true },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuthContext();
  
  const userRole = (user?.role || localStorage.getItem('role') || 'user').toLowerCase();

  return (
    // Force the custom dark teal background onto the shadcn root sidebar element
    <Sidebar className="border-r border-[#006666] !bg-[#004c4c]">
      <SidebarContent className="!bg-[#004c4c] p-2">
        <SidebarGroup>
          {/* ProCRM App Title styled using your palette */}
          <SidebarGroupLabel className="text-2xl font-black px-4 py-8 text-white tracking-wide">
            Pro<span className="text-[#66b2b2]">CRM</span>
          </SidebarGroupLabel>
          
          <SidebarGroupContent className="mt-4">
            <SidebarMenu className="gap-1.5">
              {menuItems
                .filter((item) => !item.adminOnly || userRole === 'admin')
                .map((item) => {
                  const isActive = location.pathname === item.url;
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={`
                          w-full transition-all duration-200 ease-in-out px-4 py-3 rounded-xl font-medium
                          ${isActive
                            ? '!bg-[#008080] !text-white shadow-md shadow-[#004c4c]/40'
                            : 'text-[#b2d8d8] hover:!bg-[#006666] hover:!text-white'
                          }
                        `}
                      >
                        <Link to={item.url} className="flex flex-row items-center gap-3 w-full">
                          <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-[#66b2b2]'}`} />
                          <span className="text-[15px]">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}