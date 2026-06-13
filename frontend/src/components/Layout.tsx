import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-text-primary)]">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
