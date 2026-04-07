import { LayoutDashboard, Map, Building2, Users, Bell, FileBarChart, Settings, LogOut, Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Outbreak Map", url: "/dashboard/outbreak", icon: Map },
  { title: "Hospitals", url: "/dashboard/hospitals", icon: Building2 },
  { title: "Patients", url: "/dashboard/patients", icon: Users },
  { title: "Alerts", url: "/dashboard/alerts", icon: Bell },
  { title: "Reports", url: "/dashboard/reports", icon: FileBarChart },
];

const systemNav = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="p-4 flex items-center gap-3 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
          <Activity className="h-4.5 w-4.5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h2 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">HealthDash</h2>
            <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">Admin Panel</p>
          </div>
        )}
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest px-4">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 text-[10px] uppercase tracking-widest px-4">
            {!collapsed && "System"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNav.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-semibold text-sidebar-accent-foreground flex-shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-xs font-medium text-sidebar-accent-foreground truncate">Admin User</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">admin@healthdash.rw</p>
            </div>
          )}
          {!collapsed && (
            <NavLink to="/login" className="text-sidebar-foreground/50 hover:text-sidebar-accent-foreground transition-colors">
              <LogOut className="h-4 w-4" />
            </NavLink>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
