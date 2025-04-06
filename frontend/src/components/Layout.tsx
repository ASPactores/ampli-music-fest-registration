import { BottomNavbar } from "./BottomNavbar";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <BottomNavbar />
      <Outlet />
    </div>
  );
}
