import { useState } from "react";

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const formatDateForDisplay = (date) => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString();
};

const getPriorityClass = (priority) => {
  if (priority === "high") return "priority-badge priority-high";
  if (priority === "medium") return "priority-badge priority-medium";
  return "priority-badge priority-low";
};

const getCategoryClass = (category) => {
  if (category === "Personal") return "category-chip category-personal";
  if (category === "Study") return "category-chip category-study";
  return "category-chip category-work";
};

function TaskCard({ task, onDelete, onUpdate, onToggleStatus }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "pending",
    priority: task.priority || "medium",
    category: task.category || "Work",
    dueDate: formatDateForInput(task.dueDate),
  });

  const taskId = task._id || task.id;
  const status = task.status || "pending";
  const priority = task.priority || "medium";
  const category = task.category || "Work";

  const statusClass =
    status === "completed" ? "badge completed" : "badge pending";

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!onUpdate) return;

    try {
      setSaving(true);

      await onUpdate(taskId, {
        ...editForm,
        dueDate: editForm.dueDate || null,
      });

      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="task-card">
        <h3>Edit Task</h3>

        <div className="edit-form">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleChange}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={editForm.description}
            onChange={handleChange}
          />

          <label>Status</label>
          <select name="status" value={editForm.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <label>Priority</label>
          <select
            name="priority"
            value={editForm.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label>Category</label>
          <select
            name="category"
            value={editForm.category}
            onChange={handleChange}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>

          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={editForm.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="task-actions">
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            {saving && <span className="button-spinner"></span>}
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            className="cancel-btn"
            onClick={() => setIsEditing(false)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>

        <span className={statusClass}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <p className="task-description">
        {task.description || "No description"}
      </p>

      <p>
        <strong>Priority:</strong>{" "}
        <span className={getPriorityClass(priority)}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </p>

      <p>
        <strong>Category:</strong>{" "}
        <span className={getCategoryClass(category)}>{category}</span>
      </p>

      <p>
        <strong>Due Date:</strong> {formatDateForDisplay(task.dueDate)}
      </p>

      <div className="task-actions">
        {onToggleStatus && (
          <button
            className={
              status === "completed" ? "pending-toggle-btn" : "complete-btn"
            }
            onClick={() => onToggleStatus(task)}
          >
            {status === "completed" ? "Mark Pending" : "Mark Completed"}
          </button>
        )}

        {onUpdate && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}

        {onDelete && (
          <button className="delete-btn" onClick={() => onDelete(taskId)}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
