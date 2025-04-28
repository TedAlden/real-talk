import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <div className="bg-yellow-200 text-center p-2 text-sm text-black">
        Public Layout active  {/* just for testing purposes, div to be deleted */}
      </div>
      <main className="container mx-auto mt-4">
        <Outlet />
      </main>
    </>
  );
}
