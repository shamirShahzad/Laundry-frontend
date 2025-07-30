import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Components/AppSidebar";
import BreadCrumbs from "./Components/BreadCrumbs";
// import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import "./Layout.css";
// import { useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  // const navigate = useNavigate();
  // const location = useLocation();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center justify-center w-full h-12 border-b">
          <SidebarTrigger />
          <BreadCrumbs />
          {/* <div className="flex gap-2 mr-3">
            {location.pathname === "/register" ? null : (
              <Button
                variant="default"
                className="register"
                onClick={() => {
                  navigate("/register");
                }}
              >
                Register
              </Button>
            )}
            <Button variant="default" className="login ">
              Login
            </Button>
          </div> */}
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
