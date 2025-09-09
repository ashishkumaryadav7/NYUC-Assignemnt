import React, { useEffect, useState } from 'react';

const init = { title: '', description: '', status: 'Pending', deadline: '' };

export default function TaskForm({ onSubmit, onCancel, editing }) {
  const [form, setForm] = useState(init);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description || '',
        status: editing.status,
        deadline: editing.deadline ? editing.deadline.slice(0, 10) : ''
      });
    } else {
      setForm(init);
    }
  }, [editing]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

 const submit = async (e) => {
  e.preventDefault();
  await onSubmit(form); 
  if (!editing) {
    setForm(init); // clear after adding
  }
};

  return (
    <form className="form task-from" onSubmit={submit}>
      <div className="row">
        <input name="title" placeholder="Title" value={form.title} onChange={change} required />
      </div>
      <div className="row">
        <textarea name="description" placeholder="Description" value={form.description} onChange={change} rows={3} />
      </div>
      <div className="row">
        <select name="status" value={form.status} onChange={change}>
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Completed</option>
        </select>
        <input type="date" name="deadline" value={form.deadline} onChange={change} />
      </div>
      <div className="row actions">
        <button className="btn" type="submit">{editing ? 'Update Task' : 'Add Task'}</button>
        {editing && <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
