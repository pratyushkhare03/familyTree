// src/components/modals/EditProfileModal.jsx
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function EditProfileModal({ show, member, onClose, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (show && member) {
      setForm({
        name: member.name || '',
        title: member.title || member.notes || '',
        location: member.location || '',
        email: member.email || '',
        phone: member.phone || '',
        website: member.website || '',
        about: member.about || '',
        experience: member.experience || [],
        education: member.education || [],
        skills: member.skills || [],
        achievements: member.achievements || [],
        avatarUrl: member.avatarUrl || '',
        bannerUrl: member.bannerUrl || '',
      });
    }
  }, [show, member]);

  // Optional: lock page scroll when modal is open
  useEffect(() => {
    const root = document.documentElement;
    if (show) root.classList.add('overflow-y-hidden');
    else root.classList.remove('overflow-y-hidden');
    return () => root.classList.remove('overflow-y-hidden');
  }, [show]);

  if (!show || !form) return null;

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toList = (s) => s.split(',').map(x => x.trim()).filter(Boolean);
  const safeParse = (s) => { try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; } };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Scrollable container */}
      <div className="absolute inset-0 overflow-y-auto">
        {/* Centering shim */}
        <div className="min-h-full flex items-center justify-center p-3">
          {/* Dialog panel */}
          <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-xl shadow-xl text-slate-800 dark:text-slate-100
                          max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header (fixed) */}
            <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg sm:text-xl font-bold">Edit Profile</h2>
              <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" onClick={onClose} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body (scrollable) */}
            <div className="overflow-y-auto p-4 sm:p-6">
              <div className="grid sm:grid-cols-2 gap-3">
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="Headline / Title" value={form.title} onChange={(e) => update('title', e.target.value)} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="Location" value={form.location} onChange={(e) => update('location', e.target.value)} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" placeholder="Website" value={form.website} onChange={(e) => update('website', e.target.value)} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 sm:col-span-2" placeholder="Banner URL" value={form.bannerUrl} onChange={(e) => update('bannerUrl', e.target.value)} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 sm:col-span-2" placeholder="Avatar URL" value={form.avatarUrl} onChange={(e) => update('avatarUrl', e.target.value)} />
                <textarea className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 sm:col-span-2" rows={4} placeholder="About" value={form.about} onChange={(e) => update('about', e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <textarea className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" rows={5} placeholder='Experience JSON e.g. [{"role":"...","company":"...","period":"...","desc":"..."}]' value={JSON.stringify(form.experience || [])} onChange={(e) => update('experience', safeParse(e.target.value))} />
                <textarea className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" rows={5} placeholder='Education JSON e.g. [{"school":"...","degree":"...","period":"..."}]' value={JSON.stringify(form.education || [])} onChange={(e) => update('education', safeParse(e.target.value))} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 sm:col-span-2" placeholder='Skills comma-separated e.g. "React, Tailwind, Firebase"' value={(form.skills || []).join(', ')} onChange={(e) => update('skills', toList(e.target.value))} />
                <input className="p-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 sm:col-span-2" placeholder='Achievements comma-separated' value={(form.achievements || []).join(', ')} onChange={(e) => update('achievements', toList(e.target.value))} />
              </div>
            </div>

            {/* Footer (fixed) */}
            <div className="flex justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
              <button className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded" onClick={onClose}>Cancel</button>
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded" onClick={() => onSave(form)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
