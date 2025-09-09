import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import BASE_URL from '../api/url'


export default function Login() {
  const { setSession } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || 'Login failed');
    } else {
      setSession(data.data.accessToken, data.data.user);
      const to = (loc.state && loc.state.from && loc.state.from.pathname) || '/dashboard';
      nav(to, { replace: true });
    }
  };

  return (
    <div className="auth">
      <form className="form card" onSubmit={submit}>
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <input name="email" placeholder="Email" value={form.email} onChange={change} type="email" required />
        <input name="password" placeholder="Password" value={form.password} onChange={change} type="password" required />
        <button className="btn" type="submit">Login</button>
        <div className="small">No account? <Link to="/signup">Sign up</Link></div>
      </form>
    </div>
  );
}
