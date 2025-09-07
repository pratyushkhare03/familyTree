import React from 'react';
import { X } from 'lucide-react';

export default function AddBoardModal({
  show,
  onClose,
  newBoardForm,
  setNewBoardForm,
  submitNewBoard,
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6 relative">
        <button
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">Create New Board (Root)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Root member name</label>
            <input
              className="w-full p-2 border rounded text-sm sm:text-base"
              value={newBoardForm.rootName}
              onChange={(e) => setNewBoardForm((f) => ({ ...f, rootName: e.target.value }))}
              placeholder="Leader / Root name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">DOB</label>
            <input
              className="w-full p-2 border rounded text-sm sm:text-base"
              value={newBoardForm.dob}
              onChange={(e) => setNewBoardForm((f) => ({ ...f, dob: e.target.value }))}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Spouse</label>
            <input
              className="w-full p-2 border rounded text-sm sm:text-base"
              value={newBoardForm.spouse}
              onChange={(e) => setNewBoardForm((f) => ({ ...f, spouse: e.target.value }))}
              placeholder="Optional"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded text-sm sm:text-base"
              value={newBoardForm.notes}
              onChange={(e) => setNewBoardForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2 sm:gap-3 justify-end">
          <button className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm sm:text-base" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm sm:text-base"
            onClick={submitNewBoard}
          >
            Create Board
          </button>
        </div>
      </div>
    </div>
  );
}
