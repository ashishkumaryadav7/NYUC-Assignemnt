import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BASE_URL from '../api/url'


export default function Signup() {
  const { setSession } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || 'Signup failed');
    } else {
      setSession(data.data.accessToken, data.data.user);
      nav('/dashboard', { replace: true });
    }
  };

  return (
    <div className="auth">
      <form className="form card" onSubmit={submit}>
        <h2>Sign Up</h2>
        {err && <div className="error">{err}</div>}
        <input name="name" placeholder="Name" value={form.name} onChange={change} required />
        <input name="email" placeholder="Email" value={form.email} onChange={change} type="email" required />
        <input name="password" placeholder="Password" value={form.password} onChange={change} type="password" required />
        <button className="btn" type="submit">Create Account</button>
        <div className="small">Have an account? <Link to="/login">Log in</Link></div>
      </form>
    </div>
  );
}
