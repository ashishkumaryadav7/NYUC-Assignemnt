import React from 'react';

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{task.title}</h3>
        <span className={`badge ${task.status.replace(' ', '').toLowerCase()}`}>{task.status}</span>
      </div>
      <p className="desc">{task.description || 'No description'}</p>
      <div className="meta">
        {task.deadline ? <span>Due: {new Date(task.deadline).toLocaleDateString()}</span> : <span>No deadline</span>}
        <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
      </div>
      <div className="actions">
        <button className="btn secondary" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </div>
  );
}
