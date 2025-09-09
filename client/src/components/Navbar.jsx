import React from 'react';
import BASE_URL from '../api/url.js'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, setSession, accessToken } = useAuth();
  const nav = useNavigate();

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    setSession(null, null);
    nav('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-brand">Task Manager</div>
      <div className="nav-links">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'link active' : 'link')}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? 'link active' : 'link')}
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
