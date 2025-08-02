import "./AppSidebar.css";
import {
  Calendar,
  Home,
  Search,
  Settings,
  UserRoundPlus,
  UserRound,
} from "lucide-react";
// import useSidebar from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import NonCollapsibleItem from "./NonCollapsibleItem";
import CollapsibleItems from "./CollapsibleItems";
import { useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Customers",
    url: "/customers",
    Icon: UserRound,
    items: [
      {
        title: "Add customers",
        url: "/customers/add",
        Icon: UserRoundPlus,
      },
    ],
  },
  {
    title: "Calendar",
    url: "/calendar",
    Icon: Calendar,
    items: [],
  },
  {
    title: "Search",
    url: "#",
    Icon: Search,
    items: [],
  },
  {
    title: "Settings",
    url: "#",
    Icon: Settings,
    items: [],
  },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Laundry</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NonCollapsibleItem
                title="Dashboard"
                url="/dashboard"
                Icon={Home}
                locationPath={location.pathname}
              />
              <CollapsibleItems
                items={items}
                locationPath={location.pathname}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
