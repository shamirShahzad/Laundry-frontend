import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./Components/AppSidebar";
import BreadCrumbs from "./Components/BreadCrumbs";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import "./Layout.css";
import { Button } from "./components/ui/button";
import { API } from "./lib/utils/Axios";
import { useAuth } from "./context/AuthContext";

export default function Layout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const handleLogut = async () => {
    const res = await API.post("/users/logout");
    if (res.data.success) {
      auth.logout();
      navigate("/");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full flex flex-col max-h-screen overflow-hidden">
        <div className="flex items-center justify-center w-full h-12 border-b">
          <SidebarTrigger />
          <BreadCrumbs />
          <div className="flex gap-2 mr-5 mb-1">
            <Button variant="default" className="login" onClick={handleLogut}>
              Logout
            </Button>
          </div>
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
