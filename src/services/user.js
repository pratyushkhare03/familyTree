// src/services/user.js
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export async function getUserDoc(uid = auth.currentUser?.uid) {
  if (!uid) return null;
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function upsertUserDoc(data, uid = auth.currentUser?.uid) {
  if (!uid) throw new Error('No uid');
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { ...data, updatedAt: Date.now() }, { merge: true });
}

export async function updateUserDoc(data, uid = auth.currentUser?.uid) {
  if (!uid) throw new Error('No uid');
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...data, updatedAt: Date.now() });
}
