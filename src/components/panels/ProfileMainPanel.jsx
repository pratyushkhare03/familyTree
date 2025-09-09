// src/components/panels/ProfileMainPanel.jsx
import React from 'react';
import { Camera, Shield, KeyRound, Smartphone, LogOut, Link2, Bell, Trash2, AlertTriangle, QrCode, Download } from 'lucide-react';

export default function ProfileMainPanel({
  profile, setProfile, savingProfile, onSaveProfile,
  pwd, setPwd, savingPwd, onChangePassword,
  twoFAEnabled, twoFASetup, twoFACode, setTwoFACode, saving2FA,
  onEnable2FA, onVerify2FA, onDisable2FA, onDownloadBackupCodes,
  revoking, onRevokeSessions,
  providers, setProviders, savingProviders, onToggleProvider,
  notifs, setNotifs, savingNotifs, onSaveNotifications,
  deactivateReason, setDeactivateReason, deleting, deleteConfirm, setDeleteConfirm,
  onDeactivateAccount, onDeleteAccount,
}) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header like Members */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-3">Profile</h2>

      {/* Profile card */}
      <div className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (<Camera className="w-5 h-5 text-gray-500" />)}
          </div>
          <label className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                const file = files && files;
                if (!file) return;
                const url = URL.createObjectURL(file);
                setProfile((prev) => ({ ...prev, avatarUrl: url }));
              }}
            />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          <input className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="Full name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
          <input className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="Email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
          <input className="sm:col-span-2 p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="Phone (optional)" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button disabled={savingProfile} onClick={onSaveProfile} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded">
            {savingProfile ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>

      {/* Security: Password */}
      <div className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4" /><span className="text-sm font-semibold">Security</span></div>
        <div className="grid sm:grid-cols-3 gap-2">
          <input type="password" className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="Current password" value={pwd.current} onChange={(e) => setPwd((s) => ({ ...s, current: e.target.value }))} />
          <input type="password" className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="New password" value={pwd.next} onChange={(e) => setPwd((s) => ({ ...s, next: e.target.value }))} />
          <input type="password" className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="Confirm new password" value={pwd.confirm} onChange={(e) => setPwd((s) => ({ ...s, confirm: e.target.value }))} />
        </div>
        <div className="mt-3">
          <button disabled={savingPwd} onClick={onChangePassword} className="px-3 py-2 bg-gray-800 hover:bg-black text-white rounded">{savingPwd ? 'Updating…' : 'Change password'}</button>
        </div>
      </div>

      {/* 2FA */}
      <div className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <div className="flex items-center gap-2 mb-2"><KeyRound className="w-4 h-4" /><span className="text-sm font-semibold">Two‑Factor Authentication (2FA)</span></div>
        {!twoFAEnabled ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-slate-300">Enable 2FA with an authenticator app. Scan the QR and verify a code. Download backup codes for recovery.</p>
            <div className="flex items-start gap-4">
              <div className="w-40 h-40 border rounded flex items-center justify-center border-slate-200 dark:border-slate-700">
                {twoFASetup.qrSvg ? (<div dangerouslySetInnerHTML={{ __html: twoFASetup.qrSvg }} />) : (<QrCode className="w-10 h-10 text-gray-400" />)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <button disabled={saving2FA} onClick={onEnable2FA} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded">{saving2FA ? 'Preparing…' : 'Start setup'}</button>
                  <button onClick={onDownloadBackupCodes} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center gap-2"><Download className="w-4 h-4" /> Backup codes</button>
                </div>
                <div className="flex gap-2 items-center">
                  <input className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="6‑digit code" value={twoFACode} onChange={(e) => setTwoFACode(e.target.value)} />
                  <button disabled={saving2FA || !twoFACode} onClick={onVerify2FA} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded">Verify & enable</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700">2FA is enabled.</p>
            <button disabled={saving2FA} onClick={onDisable2FA} className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100">Disable 2FA</button>
          </div>
        )}
      </div>

      {/* Sessions */}
      <div className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <div className="flex items-center gap-2 mb-2"><Smartphone className="w-4 h-4" /><span className="text-sm font-semibold">Sessions & Devices</span></div>
        <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">Revoke other devices if lost or suspicious activity is detected.</p>
        <button disabled={revoking} onClick={onRevokeSessions} className="px-3 py-2 bg-gray-100 dark:bg-slate-700 rounded hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center gap-2"><LogOut className="w-4 h-4" /> {revoking ? 'Revoking…' : 'Sign out other sessions'}</button>
      </div>

      {/* Connected accounts */}
      <div className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <div className="flex items-center gap-2 mb-2"><Link2 className="w-4 h-4" /><span className="text-sm font-semibold">Connected Accounts</span></div>
        <div className="grid sm:grid-cols-3 gap-2">
          {['google', 'github', 'microsoft'].map((p) => (
            <label key={p} className="flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <span className="text-sm capitalize">{p}</span>
              <input type="checkbox" checked={!!providers[p]} onChange={(e) => setProviders((prev) => ({ ...prev, [p]: e.target.checked }))} onBlur={(e) => onToggleProvider?.(p, e.target.checked)} />
            </label>
          ))}
        </div>
        {savingProviders && <p className="text-xs text-gray-500 mt-2">Saving…</p>}
      </div>

      {/* Notifications */}
      <div className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-4">
        <div className="flex items-center gap-2 mb-2"><Bell className="w-4 h-4" /><span className="text-sm font-semibold">Notifications</span></div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <label className="flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <span>Email: Product updates</span>
            <input type="checkbox" checked={notifs.emailProduct} onChange={(e) => setNotifs((n) => ({ ...n, emailProduct: e.target.checked }))} />
          </label>
          <label className="flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <span>Email: Security alerts</span>
            <input type="checkbox" checked={notifs.emailSecurity} onChange={(e) => setNotifs((n) => ({ ...n, emailSecurity: e.target.checked }))} />
          </label>
          <label className="flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <span>Email: Reminders</span>
            <input type="checkbox" checked={notifs.emailReminders} onChange={(e) => setNotifs((n) => ({ ...n, emailReminders: e.target.checked }))} />
          </label>
          <label className="flex items-center justify-between p-2 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <span>Push: Announcements</span>
            <input type="checkbox" checked={notifs.pushAnnouncements} onChange={(e) => setNotifs((n) => ({ ...n, pushAnnouncements: e.target.checked }))} />
          </label>
        </div>
        <div className="mt-3">
          <button disabled={savingNotifs} onClick={onSaveNotifications} className="px-3 py-2 bg-gray-800 hover:bg-black text-white rounded">{savingNotifs ? 'Saving…' : 'Save preferences'}</button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="p-3 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
        <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-600" /><span className="text-sm font-semibold text-red-700">Danger Zone</span></div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">Temporarily deactivate this account. You can sign back in later to reactivate.</p>
            <input className="w-full p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="Reason (optional but helpful)" value={deactivateReason} onChange={(e) => setDeactivateReason(e.target.value)} />
            <button onClick={onDeactivateAccount} className="mt-2 px-3 py-2 bg-yellow-50 text-yellow-800 rounded hover:bg-yellow-100">Deactivate account</button>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
            <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">Permanently delete this account and all data. This cannot be undone.</p>
            <div className="grid sm:grid-cols-2 gap-2">
              <input className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder='Type "DELETE" to confirm' value={deleteConfirm.text} onChange={(e) => setDeleteConfirm((d) => ({ ...d, text: e.target.value }))} />
              <input type="password" className="p-2 rounded text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" placeholder="Password" value={deleteConfirm.password} onChange={(e) => setDeleteConfirm((d) => ({ ...d, password: e.target.value }))} />
            </div>
            <button disabled={deleting} onClick={onDeleteAccount} className="mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2"><Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Delete account'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
