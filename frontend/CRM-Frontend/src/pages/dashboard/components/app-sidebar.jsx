import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, Users, BarChart3, CheckSquare, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Pipelines", url: "/pipelines", icon: BarChart3 },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold">CRM System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>

                <SidebarMenuItem key={item.title}>

                <SidebarMenuButton isActive={location.pathname === item.url} render={
                    <Link to={item.url}/>
                  }
                >
                  <item.icon />
                  <span>{item.title}</span>

                </SidebarMenuButton>

                </SidebarMenuItem>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}