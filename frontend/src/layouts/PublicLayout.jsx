import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/public/PublicNavbar";

export default function PublicLayout() {
  return (
    <>
      <PublicNavbar />
      <div className="bg-yellow-200 text-center p-2 text-sm text-black">
        Public Layout active  {/* just for testing purposes, div to be deleted */}
      </div>
      <main className="container mx-auto mt-4">
        <Outlet />
      </main>
    </>
  );
}
