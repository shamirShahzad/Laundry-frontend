import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CollapsibleItemsProps {
  items: ItemProps[];
  locationPath: string;
}
interface ItemProps {
  title: string;
  url: string;
  Icon: LucideIcon;
  items: SubItemProps[];
}
interface SubItemProps {
  title: string;
  url: string;
  Icon: LucideIcon;
}

const CollapsibleItems: React.FC<CollapsibleItemsProps> = ({
  items,
  locationPath,
}) => {
  return (
    <>
      {items.map((item: ItemProps, index: number) => {
        const hasActiveSubItem = item.items.some(
          (subItem: SubItemProps) => locationPath === subItem.url
        );
        const defaultOpen = hasActiveSubItem || index === 0;
        return (
          <Collapsible
            key={item.title}
            defaultOpen={defaultOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={locationPath === item.url}>
                <Link to={item.url} className="flex ">
                  <item.Icon />
                  {item.title}
                </Link>
              </SidebarMenuButton>
              {item?.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-180">
                      <ChevronDown />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem: SubItemProps) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={locationPath === subItem.url}
                          >
                            <Link
                              to={subItem.url}
                              className="flex justify-center w-fit"
                            >
                              <subItem.Icon strokeWidth={1.5} />
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </>
  );
};

export default CollapsibleItems;
