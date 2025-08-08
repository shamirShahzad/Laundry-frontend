import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
const BreadCrumbs = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const breadCrumbs = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    const cleanPart = decodeURIComponent(part.trim()); // handle encoded values like %20

    const isNumber = !Number.isNaN(parseInt(cleanPart, 10));
    const isUUID = uuidRegex.test(cleanPart);

    const label =
      isNumber || isUUID
        ? "Details"
        : cleanPart.charAt(0).toUpperCase() + cleanPart.slice(1);

    return { href, label };
  });

  return (
    <Breadcrumb className="w-full ml-2">
      <BreadcrumbList>
        {breadCrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={crumb.href}>{crumb.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;
