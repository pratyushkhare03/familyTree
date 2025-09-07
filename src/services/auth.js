import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  linkWithPopup,
  unlink
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export function onAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

export async function emailSignUp(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function emailSignIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function signOutAll() {
  await signOut(auth);
}

export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('No user email');
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
}

export async function linkGoogle() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  await linkWithPopup(user, googleProvider);
}

export async function unlinkProvider(providerId) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
  await unlink(user, providerId); // 'google.com'
}
