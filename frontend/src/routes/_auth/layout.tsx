import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full border-t-4 border-purple-500">
        <p className="text-xs text-purple-500 font-bold uppercase mb-4">
          Auth Layout (Pathless)
        </p>
        <Outlet />
      </div>
    </div>
  );
}
