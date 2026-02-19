import { Outlet } from "react-router-dom";
import Sidebar from "../components/Shared/sidebar/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
    
      {/* Contenido */}
      <main className="flex-1 min-w-0 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
