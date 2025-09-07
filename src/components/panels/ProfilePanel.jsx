import React from 'react';

export default function ProfilePanel({ sidebarOpen, profile, setProfile }) {
  if (!sidebarOpen) return null;
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800">Profile</h3>
      <label className="block text-sm text-gray-600">Display name</label>
      <input
        className="w-full p-2 border rounded text-sm"
        value={profile.displayName}
        onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
      />
      <label className="block text-sm text-gray-600">Email</label>
      <input
        type="email"
        className="w-full p-2 border rounded text-sm"
        value={profile.email}
        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
      />
      <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">Save</button>
    </div>
  );
}
