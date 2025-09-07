import React from 'react';
import { User, LayoutDashboard, Users, FolderPlus } from 'lucide-react';

export default function SidebarMenu({ sidebarOpen, onOpenProfile, onOpenDashboard, onOpenAddBoard, onOpenMembers }) {
  return (
    <nav className="flex-none p-3 sm:p-4 space-y-3 sm:space-y-4 border-b">
      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 min-w-0" onClick={onOpenProfile}>
        <User className="w-5 h-5" />
        {sidebarOpen && <span className="text-sm sm:text-base truncate">Profile</span>}
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 min-w-0" onClick={onOpenDashboard}>
        <LayoutDashboard className="w-5 h-5" />
        {sidebarOpen && <span className="text-sm sm:text-base truncate">Dashboard</span>}
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 min-w-0" onClick={onOpenAddBoard}>
        <FolderPlus className="w-5 h-5" />
        {sidebarOpen && <span className="text-sm sm:text-base truncate">Add Family</span>}
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 min-w-0" onClick={onOpenMembers}>
        <Users className="w-5 h-5" />
        {sidebarOpen && <span className="text-sm sm:text-base truncate">Members List</span>}
      </div>
    </nav>
  );
}
