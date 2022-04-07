import { Outlet } from "@remix-run/react";
import AppBar from "~/components/AppBar";


export default function TopicsPage() {
  return (
    <div className="md:container md:mx-auto">
      <AppBar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
