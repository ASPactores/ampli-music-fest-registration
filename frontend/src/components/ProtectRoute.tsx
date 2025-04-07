import { useCookies } from "react-cookie";
import { JSX } from "react";
import { Navigate } from "react-router";

export default function ProtectRoute({
  children,
  accessBy,
}: {
  children: JSX.Element;
  accessBy: string;
}) {
  const [cookies] = useCookies(["uid"]);
  const uid = cookies.uid;
  const isLoggedIn = Boolean(uid);

  if (accessBy === "non-authenticated" && !isLoggedIn) {
    return children;
  }

  if (accessBy === "authenticated" && isLoggedIn) {
    return children;
  }

  if (accessBy === "authenticated" && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/admin/scan" replace />;
}
