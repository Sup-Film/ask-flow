import { Outlet, Link } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="p-6 border-2 border-dashed border-blue-500 rounded-lg m-4">
      <h1 className="text-xl font-bold text-blue-500 mb-4">
        Dashboard Layout (Nested Route)
      </h1>
      <nav className="flex gap-4 mb-4">
        <Link to="/dashboard" className="underline">
          Overview
        </Link>
        <Link to="/dashboard/settings" className="underline">
          Settings
        </Link>
      </nav>
      <div className="p-4 border border-gray-200 rounded">
        <Outlet />
      </div>
    </div>
  );
}
