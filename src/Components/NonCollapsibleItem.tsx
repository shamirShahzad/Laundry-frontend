import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface NonCollapsibleItemProps {
  title: string;
  url: string;
  Icon: LucideIcon;
  locationPath: string;
}

const NonCollapsibleItem: React.FC<NonCollapsibleItemProps> = ({
  title,
  url,
  Icon,
  locationPath,
}) => {
  const isActive = locationPath === url;

  return (
    <SidebarMenuItem key={title}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={url}>
          <Icon />
          {title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default NonCollapsibleItem;
