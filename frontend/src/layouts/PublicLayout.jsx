import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/public/PublicNavbar";

export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <main className="container mx-auto mt-4">
        <Outlet />
      </main>
    </>
  );
}
