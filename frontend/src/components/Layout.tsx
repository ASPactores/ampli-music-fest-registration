import { BottomNavbar } from "./BottomNavbar";
import { Outlet } from "react-router";
import logo from "@/assets/sari_sari_main_logo.svg";

export default function Layout() {
  return (
    <div>
      <div className="flex flex-col items-center p-4 bg-white gap-4">
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 lg:w-10 lg:h-8 mb-4 mx-auto mt-4"
        />
      </div>
      <BottomNavbar />
      <Outlet />
    </div>
  );
}
