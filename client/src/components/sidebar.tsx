import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Team", href: "/team", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Admin", href: "/admin", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  const getUserRole = (role?: string | null) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "user":
      default:
        return "User";
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white shadow-lg w-64 min-h-screen flex flex-col transition-all duration-300 relative z-30",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo and Brand */}
        <div className="p-6 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center bg-primary-600 rounded-xl">
              <CheckSquare className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">TaskFlow</h1>
              <p className="text-xs text-secondary-600">Task Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            // Hide admin link for non-admin users
            if (item.href === "/admin" && user?.role !== "admin") {
              return null;
            }

            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                  )}
                  onClick={() => onClose()}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-secondary-200">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-secondary-50 transition-colors">
            <div className="h-10 w-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {getInitials(user?.firstName, user?.lastName)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "User"}
              </p>
              <p className="text-xs text-secondary-600 truncate">
                {getUserRole(user?.role)}
              </p>
            </div>
            <button
              onClick={() => {
                window.location.href = "/api/logout";
              }}
              className="p-2 text-secondary-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
