import React from 'react';
import TaskCard from './TaskCard.jsx';

export default function TaskList({ items, onEdit, onDelete }) {
  if (!items.length) return <div className="empty">No tasks found</div>;
  return (
    <div className="grid">
      {items.map((t) => (
        <TaskCard key={t._id} task={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
