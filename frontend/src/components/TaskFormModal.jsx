import { useEffect, useState } from 'react';

import { validateTaskForm } from '../utils/validation';

const emptyTask = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: ''
};

const normalizeTask = (task) => ({
  title: task?.title || '',
  description: task?.description || '',
  status: task?.status || 'todo',
  dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : ''
});

export default function TaskFormModal({ open, mode, task, saving, onClose, onSubmit }) {
  const [formState, setFormState] = useState(emptyTask);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormState(task ? normalizeTask(task) : emptyTask);
      setErrors({});
    }
  }, [open, task]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleChange = (field, value) => {
    setFormState((currentFormState) => ({
      ...currentFormState,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateTaskForm(formState);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    await onSubmit({
      title: formState.title.trim(),
      description: formState.description.trim(),
      status: formState.status,
      dueDate: formState.dueDate || null
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">{mode === 'create' ? 'New Task' : 'Edit Task'}</p>
            <h2 id="task-modal-title">
              {mode === 'create' ? 'Capture your next deliverable' : 'Update task details'}
            </h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close task form">
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={formState.title}
              onChange={(event) => handleChange('title', event.target.value)}
              placeholder="Ship recruiter-ready dashboard"
            />
            {errors.title ? <span className="field-error">{errors.title}</span> : null}
          </label>

          <label>
            Description
            <textarea
              rows="4"
              value={formState.description}
              onChange={(event) => handleChange('description', event.target.value)}
              placeholder="Add context, dependencies, or notes"
            />
            {errors.description ? <span className="field-error">{errors.description}</span> : null}
          </label>

          <div className="modal-grid">
            <label>
              Status
              <select value={formState.status} onChange={(event) => handleChange('status', event.target.value)}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>

            <label>
              Due date
              <input
                type="date"
                value={formState.dueDate}
                onChange={(event) => handleChange('dueDate', event.target.value)}
              />
              {errors.dueDate ? <span className="field-error">{errors.dueDate}</span> : null}
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="button button-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? 'Saving...' : mode === 'create' ? 'Create task' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
