import React, { useEffect, useMemo, useState } from 'react';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api/client.js';

export default function Dashboard() {
  const { accessToken, refresh } = useAuth();
  const getToken = () => accessToken;
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    const res = await apiFetch(`/tasks?${params.toString()}`, {}, getToken, refresh);
    const data = await res.json();
    if (res.ok) setItems(data.data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status]);

  const create = async (payload) => {
    const res = await apiFetch('/tasks', { method: 'POST', body: payload }, getToken, refresh);
    if (res.ok) {
      setEditing(null);
      await load();
    }
  };

  const update = async (payload) => {
    const res = await apiFetch(`/tasks/${editing._id}`, { method: 'PATCH', body: payload }, getToken, refresh);
    if (res.ok) {
      setEditing(null);
      await load();
    }
  };

  const remove = async (task) => {
    if (!confirm('Delete this task?')) return;
    const res = await apiFetch(`/tasks/${task._id}`, { method: 'DELETE' }, getToken, refresh);
    if (res.ok) await load();
  };

  const onSubmit = (form) => (editing ? update(form) : create(form));

  return (
    <div className="container">
      <div className="toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Completed</option>
        </select>
        <input placeholder="Search title/description" value={q} onChange={(e) => setQ(e.target.value)} onBlur={(e) => {
          if (e.target.value.trim() === '') {
            load();
          }
        }} />
        <button className="btn" onClick={load}>Search</button>
      </div>

      <div className="layout">
        <div className="left">
          <TaskForm editing={editing} onSubmit={onSubmit} onCancel={() => setEditing(null)} />
        </div>
        <div className="right">
          {loading ? <div className="loading">Loading...</div> :
            <TaskList items={items} onEdit={setEditing} onDelete={remove} />
          }
        </div>
      </div>
    </div>
  );
}
