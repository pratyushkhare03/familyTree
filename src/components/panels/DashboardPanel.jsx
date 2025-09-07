import React from 'react';

export default function DashboardPanel({ sidebarOpen, stats }) {
  if (!sidebarOpen) return null;
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Dashboard</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Members</div>
          <div className="text-lg font-semibold">{stats.count}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-xs text-gray-500">Generations</div>
          <div className="text-lg font-semibold">{stats.generations}</div>
        </div>
      </div>
    </div>
  );
}
