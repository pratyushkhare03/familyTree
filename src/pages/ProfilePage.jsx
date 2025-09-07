import React, { useState } from 'react';
import { Shield, KeyRound, Smartphone, LogOut, Link2, Bell, Trash2, AlertTriangle, QrCode, Download, Camera } from 'lucide-react';

// Optional: accept user and actions via props or context
export default function ProfilePage({
  user = {
    avatarUrl: '',
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    phone: '',
  },
  onUpdateProfile,       // async (payload) => void
  onChangePassword,      // async ({ currentPassword, newPassword }) => void
  onEnable2FA,           // async () => ({ otpauthUrl, qrSvg? })
  onVerify2FA,           // async (code) => void
  onDisable2FA,          // async () => void
  onDownloadBackupCodes, // async () => Blob or string[]
  onRevokeSessions,      // async () => void
  onToggleProvider,      // async (provider, enabled) => void
  onSaveNotifications,   // async (prefs) => void
  onDeactivateAccount,   // async ({ reason }) => void
  onDeleteAccount,       // async ({ confirmText, password }) => void
}) {
  // Local editable state
  const [profile, setProfile] = useState(user);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [savingPwd, setSavingPwd] = useState(false);

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFASetup, setTwoFASetup] = useState({ otpauthUrl: '', qrSvg: '' });
  const [twoFACode, setTwoFACode] = useState('');
  const [saving2FA, setSaving2FA] = useState(false);

  // Sessions
  const [revoking, setRevoking] = useState(false);

  // Connected accounts
  const [providers, setProviders] = useState({
    google: false,
    github: false,
    microsoft: false,
  });
  const [savingProviders, setSavingProviders] = useState(false);

  // Notifications
  const [notifs, setNotifs] = useState({
    emailProduct: true,
    emailSecurity: true,
    emailReminders: false,
    pushAnnouncements: false,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  // Danger zone
  const [deactivateReason, setDeactivateReason] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ text: '', password: '' });

  // Handlers
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      await onUpdateProfile?.(profile);
      alert('Profile updated');
    } catch (e) {
      alert('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwd.next || pwd.next !== pwd.confirm) {
      alert('New passwords do not match');
      return;
    }
    try {
      setSavingPwd(true);
      await onChangePassword?.({ currentPassword: pwd.current, newPassword: pwd.next });
      setPwd({ current: '', next: '', confirm: '' });
      alert('Password updated');
    } catch {
      alert('Failed to change password');
    } finally {
      setSavingPwd(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setSaving2FA(true);
      const setup = await onEnable2FA?.(); // returns { otpauthUrl, qrSvg? }
      setTwoFASetup(setup || {});
    } catch {
      alert('Failed to start 2FA setup');
    } finally {
      setSaving2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFACode) return;
    try {
      setSaving2FA(true);
      await onVerify2FA?.(twoFACode);
      setTwoFAEnabled(true);
      setTwoFACode('');
      alert('2FA enabled');
    } catch {
      alert('Invalid verification code');
    } finally {
      setSaving2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      setSaving2FA(true);
      await onDisable2FA?.();
      setTwoFAEnabled(false);
      setTwoFASetup({ otpauthUrl: '', qrSvg: '' });
      alert('2FA disabled');
    } catch {
      alert('Failed to disable 2FA');
    } finally {
      setSaving2FA(false);
    }
  };

  const handleDownloadBackupCodes = async () => {
    try {
      const res = await onDownloadBackupCodes?.();
      if (!res) return;
      // simple download flow
      const content = Array.isArray(res) ? res.join('\n') : res;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'backup-codes.txt';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download backup codes');
    }
  };

  const handleRevokeSessions = async () => {
    try {
      setRevoking(true);
      await onRevokeSessions?.();
      alert('Other sessions revoked');
    } catch {
      alert('Failed to revoke sessions');
    } finally {
      setRevoking(false);
    }
  };

  const handleToggleProvider = async (provider, enabled) => {
    try {
      setSavingProviders(true);
      await onToggleProvider?.(provider, enabled);
      setProviders((p) => ({ ...p, [provider]: enabled }));
    } catch {
      alert('Failed to update provider');
    } finally {
      setSavingProviders(false);
    }
  };

  const handleSaveNotifs = async () => {
    try {
      setSavingNotifs(true);
      await onSaveNotifications?.(notifs);
      alert('Notification preferences saved');
    } catch {
      alert('Failed to save preferences');
    } finally {
      setSavingNotifs(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateReason.trim()) {
      alert('Please share a short reason to help improve the service');
      return;
    }
    if (!confirm('Temporarily deactivate this account? You can restore it later.')) return;
    try {
      await onDeactivateAccount?.({ reason: deactivateReason.trim() });
      alert('Account deactivated — sign in later to reactivate');
    } catch {
      alert('Failed to deactivate');
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm.text !== 'DELETE') {
      alert('Type DELETE to confirm');
      return;
    }
    if (!deleteConfirm.password) {
      alert('Enter password to confirm');
      return;
    }
    if (!confirm('This permanently deletes the account and all data. Continue?')) return;
    try {
      setDeleting(true);
      await onDeleteAccount?.({ confirmText: deleteConfirm.text, password: deleteConfirm.password });
      alert('Account deleted');
      // redirect to goodbye page or home
      window.location.href = '/';
    } catch {
      alert('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Account Settings</h1>
          <a href="/" className="text-sm text-blue-600 hover:underline">Back to app</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: profile */}
        <section className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Profile</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <label className="text-sm text-blue-600 cursor-pointer">
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]; // fixed: proper optional chaining with index [web:505][web:511]
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setProfile((p) => ({ ...p, avatarUrl: url }));
                    // TODO: upload to storage and set final URL
                  }}
                />
              </label>
            </div>
            <div className="space-y-2">
              <input className="w-full p-2 border rounded text-sm" placeholder="Full name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
              <input className="w-full p-2 border rounded text-sm" placeholder="Email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
              <input className="w-full p-2 border rounded text-sm" placeholder="Phone (optional)" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
              <button disabled={savingProfile} onClick={handleSaveProfile} className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
                {savingProfile ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Security
            </h2>
            <div className="space-y-2">
              <input type="password" className="w-full p-2 border rounded text-sm" placeholder="Current password" value={pwd.current} onChange={(e) => setPwd((s) => ({ ...s, current: e.target.value }))} />
              <input type="password" className="w-full p-2 border rounded text-sm" placeholder="New password" value={pwd.next} onChange={(e) => setPwd((s) => ({ ...s, next: e.target.value }))} />
              <input type="password" className="w-full p-2 border rounded text-sm" placeholder="Confirm new password" value={pwd.confirm} onChange={(e) => setPwd((s) => ({ ...s, confirm: e.target.value }))} />
              <button disabled={savingPwd} onClick={handleChangePassword} className="w-full py-2 bg-gray-800 text-white rounded hover:bg-black disabled:opacity-60">
                {savingPwd ? 'Updating…' : 'Change password'}
              </button>
            </div>
          </div>
        </section>

        {/* Right column: security & preferences */}
        <section className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Two‑Factor Authentication (2FA)
            </h2>
            {!twoFAEnabled ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Add a second step to sign in by using an authenticator app. Scan the QR and verify a code to enable 2FA. You can also download backup codes for recovery. </p>
                <div className="flex items-start gap-4">
                  <div className="w-40 h-40 border rounded flex items-center justify-center">
                    {twoFASetup.qrSvg ? (
                      <div dangerouslySetInnerHTML={{ __html: twoFASetup.qrSvg }} />
                    ) : (
                      <QrCode className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <button disabled={saving2FA} onClick={handleEnable2FA} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
                        {saving2FA ? 'Preparing…' : 'Start setup'}
                      </button>
                      <button onClick={handleDownloadBackupCodes} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Backup codes
                      </button>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input className="p-2 border rounded text-sm" placeholder="6‑digit code" value={twoFACode} onChange={(e) => setTwoFACode(e.target.value)} />
                      <button disabled={saving2FA || !twoFACode} onClick={handleVerify2FA} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60">
                        Verify & enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-green-700">2FA is enabled on this account.</p>
                <button disabled={saving2FA} onClick={handleDisable2FA} className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-60">
                  Disable 2FA
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" /> Sessions & Devices
            </h2>
            <p className="text-sm text-gray-600 mb-2">Sign out from other browsers and devices if you’ve lost a device or notice suspicious activity.</p>
            <button disabled={revoking} onClick={handleRevokeSessions} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-2 disabled:opacity-60">
              <LogOut className="w-4 h-4" /> {revoking ? 'Revoking…' : 'Sign out other sessions'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Connected Accounts
            </h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {['google', 'github', 'microsoft'].map((p) => (
                <label key={p} className="flex items-center justify-between p-3 border rounded">
                  <span className="text-sm capitalize">{p}</span>
                  <input
                    type="checkbox"
                    checked={providers[p]}
                    onChange={(e) => handleToggleProvider(p, e.target.checked)}
                  />
                </label>
              ))}
            </div>
            {savingProviders && <p className="text-xs text-gray-500 mt-2">Saving…</p>}
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Notifications
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <label className="flex items-center justify-between p-3 border rounded">
                <span>Email: Product updates</span>
                <input type="checkbox" checked={notifs.emailProduct} onChange={(e) => setNotifs((n) => ({ ...n, emailProduct: e.target.checked }))} />
              </label>
              <label className="flex items-center justify-between p-3 border rounded">
                <span>Email: Security alerts</span>
                <input type="checkbox" checked={notifs.emailSecurity} onChange={(e) => setNotifs((n) => ({ ...n, emailSecurity: e.target.checked }))} />
              </label>
              <label className="flex items-center justify-between p-3 border rounded">
                <span>Email: Reminders</span>
                <input type="checkbox" checked={notifs.emailReminders} onChange={(e) => setNotifs((n) => ({ ...n, emailReminders: e.target.checked }))} />
              </label>
              <label className="flex items-center justify-between p-3 border rounded">
                <span>Push: Announcements</span>
                <input type="checkbox" checked={notifs.pushAnnouncements} onChange={(e) => setNotifs((n) => ({ ...n, pushAnnouncements: e.target.checked }))} />
              </label>
            </div>
            <div className="mt-3">
              <button disabled={savingNotifs} onClick={handleSaveNotifs} className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-black disabled:opacity-60">
                {savingNotifs ? 'Saving…' : 'Save preferences'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-700 mb-2">Temporarily deactivate this account. You can sign back in later to reactivate. Consider this option if you plan to return.</p>
                <input
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Reason (optional but helpful)"
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                />
                <button onClick={handleDeactivate} className="mt-2 px-3 py-2 bg-yellow-50 text-yellow-800 rounded hover:bg-yellow-100">
                  Deactivate account
                </button>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-700 mb-2">Permanently delete this account and all associated data. This action cannot be undone. Consider exporting data before deletion.</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <input className="p-2 border rounded text-sm" placeholder='Type "DELETE" to confirm' value={deleteConfirm.text} onChange={(e) => setDeleteConfirm((d) => ({ ...d, text: e.target.value }))} />
                  <input type="password" className="p-2 border rounded text-sm" placeholder="Password" value={deleteConfirm.password} onChange={(e) => setDeleteConfirm((d) => ({ ...d, password: e.target.value }))} />
                </div>
                <button disabled={deleting} onClick={handleDelete} className="mt-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting…' : 'Delete account'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
