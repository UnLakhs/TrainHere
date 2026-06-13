import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-(--color-page) text-(--color-text-primary)">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
