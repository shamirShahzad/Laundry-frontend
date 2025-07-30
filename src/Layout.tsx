import { AppSidebar } from "./Components/AppSidebar";
import BreadCrumbs from "./Components/BreadCrumbs";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import "./Layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex items-center justify-center w-full h-12 border-b">
          <SidebarTrigger />
          <BreadCrumbs />
          <div className="flex gap-2 mr-3">
            <Button variant="default" className="register">
              Register
            </Button>
            <Button variant="default" className="login ">
              Login
            </Button>
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
