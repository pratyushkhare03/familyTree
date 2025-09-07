// functions/index.js
import { onCall } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

admin.initializeApp();

export const generateTotpSetup = onCall({ enforceAppCheck: false, cors: true }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error('Unauthenticated');

  const secret = speakeasy.generateSecret({ length: 20, name: `FamilyTree (${uid})` });
  const otpauth = secret.otpauth_url;
  const qrSvg = await qrcode.toString(otpauth, { type: 'svg' });

  await admin.firestore().doc(`users/${uid}`).set({
    twoFA: { base32: secret.base32, enabled: false }
  }, { merge: true });

  return { otpauthUrl: otpauth, qrSvg };
});

export const verifyTotp = onCall({ enforceAppCheck: false, cors: true }, async (req) => {
  const uid = req.auth?.uid;
  const code = req.data?.code;
  if (!uid || !code) throw new Error('Invalid');

  const snap = await admin.firestore().doc(`users/${uid}`).get();
  const base32 = snap.get('twoFA.base32');
  const verified = speakeasy.totp.verify({ secret: base32, encoding: 'base32', token: code, window: 1 });
  if (!verified) throw new Error('Invalid code');

  await admin.firestore().doc(`users/${uid}`).set({
    twoFA: { enabled: true }
  }, { merge: true });

  return { ok: true };
});

export const disableTotp = onCall({ enforceAppCheck: false, cors: true }, async (req) => {
  const uid = req.auth?.uid;
  if (!uid) throw new Error('Unauthenticated');
  await admin.firestore().doc(`users/${uid}`).set({
    twoFA: { base32: admin.firestore.FieldValue.delete(), enabled: false }
  }, { merge: true });
  return { ok: true };
});
