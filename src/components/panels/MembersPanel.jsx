import React from 'react';
import { Layers } from 'lucide-react';

export default function MembersPanel({
  flatMembers,
  memberQuery,
  setMemberQuery,
  addChild,
  focusMember,
  boardsList,
  activeBoardId,
  setActiveBoardId,
  resetBoardView,
  onOpenProfileDetail
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Members</h2>
      <input
        className="w-full p-2 border rounded text-sm mb-3"
        placeholder="Search by name…"
        value={memberQuery}
        onChange={(e) => setMemberQuery(e.target.value)}
      />
      <div className="space-y-2 max-h-[45vh] overflow-auto pr-1 mb-4">
        {flatMembers
          .filter((m) => m.name.toLowerCase().includes(memberQuery.toLowerCase()))
          .map((m) => (
            <div key={m.id} className="flex items-center justify-between gap-2 p-2 border rounded">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{m.name}</div>
                <div className="text-xs text-gray-500">{m.dob || '—'}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded" onClick={() => {onOpenProfileDetail(m.id);}}>
                  Go to
                </button>

              </div>
            </div>
          ))}
      </div>

      {/* Boards list below Members */}
      <div className="pt-3 border-t">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Layers className="w-4 h-4" />
          Boards (roots)
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {boardsList.map((b) => (
            <div
              key={b.id}
              className={`flex items-center justify-between gap-2 p-2 border rounded cursor-pointer ${b.id === activeBoardId ? 'bg-blue-50 border-blue-300' : ''}`}
              onClick={() => {
                setActiveBoardId(b.id);
                resetBoardView();
              }}
            >
              <div className="text-sm font-medium truncate">{b.name}</div>
              {b.id === activeBoardId && <span className="text-[10px] text-blue-600">Current</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
