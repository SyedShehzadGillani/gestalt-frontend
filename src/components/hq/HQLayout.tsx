import { Outlet } from "react-router-dom";
import { HQSidebar } from "./HQSidebar";

export function HQLayout() {
  return (
    <div className="min-h-screen bg-background hq-theme">
      <HQSidebar />
      <main className="hq-main-content">
        <Outlet />
      </main>
    </div>
  );
}
