import React from 'react';
import ProfilePage from './ProfilePage';

export default function ProfilePageContainer() {
  const onUpdateProfile = async (data) => { /* TODO: update auth profile + Firestore doc */ };
  const onChangePassword = async ({ currentPassword, newPassword }) => { /* TODO: reauth + update password */ };
  const onEnable2FA = async () => { /* TODO: functions.generateTotpSetup */ return { otpauthUrl: '', qrSvg: '' }; };
  const onVerify2FA = async (code) => { /* TODO: functions.verifyTotp */ };
  const onDisable2FA = async () => { /* TODO: functions.disableTotp */ };
  const onDownloadBackupCodes = async () => { /* TODO: functions.downloadBackupCodes */ return ['CODE-1', 'CODE-2']; };
  const onRevokeSessions = async () => { /* TODO: functions.revokeSessions + bumpSessionVersion */ };
  const onToggleProvider = async (provider, enabled) => { /* TODO: link/unlink provider */ };
  const onSaveNotifications = async (prefs) => { /* TODO: save notif prefs */ };
  const onDeactivateAccount = async ({ reason }) => { /* TODO: set status=deactivated */ };
  const onDeleteAccount = async ({ confirmText, password }) => { /* TODO: cascade delete + auth deletion */ };

  return (
    <ProfilePage
      onUpdateProfile={onUpdateProfile}
      onChangePassword={onChangePassword}
      onEnable2FA={onEnable2FA}
      onVerify2FA={onVerify2FA}
      onDisable2FA={onDisable2FA}
      onDownloadBackupCodes={onDownloadBackupCodes}
      onRevokeSessions={onRevokeSessions}
      onToggleProvider={onToggleProvider}
      onSaveNotifications={onSaveNotifications}
      onDeactivateAccount={onDeactivateAccount}
      onDeleteAccount={onDeleteAccount}
    />
  );
}
