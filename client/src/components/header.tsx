import { Search, Bell, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuClick: () => void;
  onNewTask: () => void;
}

export function Header({ onMenuClick, onNewTask }: HeaderProps) {
  const { user } = useAuth();

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </Button>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search tasks, projects, or team members..."
              className="w-80 pl-10"
            />
            <Search className="absolute left-3 top-3 text-secondary-400" size={16} />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Quick Actions */}
          <Button onClick={onNewTask} className="shadow-sm hover:shadow-md">
            <Plus size={16} className="mr-2" />
            New Task
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {getInitials(user?.firstName, user?.lastName)}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
