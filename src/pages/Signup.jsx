// src/pages/Signup.jsx
import React, { useState } from 'react';
import { emailSignUp } from '../services/auth';      // wraps createUserWithEmailAndPassword
import { upsertUserDoc } from '../services/user';    // wraps Firestore setDoc

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await emailSignUp(form.email, form.password); // 1) create Auth user [1][14]
      await upsertUserDoc({
        name: form.name,
        email: form.email,
        phone: '',
        avatarUrl: '',
        notif: { emailProduct: true, emailSecurity: true }
      }); // 2) create Firestore user doc [6][8]
      // navigate to app or show success
    } catch (err) {
      console.error(err);
      alert('Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>{/* your inputs & submit */}</form>
  );
}
