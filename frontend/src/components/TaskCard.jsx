const formatDueDate = (value) => {
  if (!value) {
    return 'No deadline';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed'
};

export default function TaskCard({ task, onEdit, onDelete, deleting }) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={`status-badge ${task.status}`}>{statusLabels[task.status]}</span>
        <span className={`due-pill ${task.isOverdue ? 'danger' : ''}`}>{formatDueDate(task.dueDate)}</span>
      </div>

      <div className="task-card-body">
        <h3>{task.title}</h3>
        <p>{task.description || 'No description added yet.'}</p>
      </div>

      <div className="task-card-footer">
        <small>Updated {new Date(task.updatedAt).toLocaleDateString()}</small>
        <div className="task-card-actions">
          <button type="button" className="button button-ghost" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={() => onDelete(task)}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
