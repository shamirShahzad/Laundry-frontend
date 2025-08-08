import "./AppSidebar.css";
import {
  Home,
  Settings,
  UserRoundPlus,
  UserRound,
  ClipboardPlusIcon,
  ClipboardIcon,
  Package2Icon,
  PackagePlus,
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
    title: "Items",
    url: "/items",
    Icon: ClipboardIcon,
    items: [
      {
        title: "Add items",
        url: "/items/add",
        Icon: ClipboardPlusIcon,
      },
    ],
  },
  {
    title: "Services",
    url: "/services",
    Icon: Package2Icon,
    items: [
      {
        title: "Add Services",
        url: "/services/add",
        Icon: PackagePlus,
      },
    ],
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
