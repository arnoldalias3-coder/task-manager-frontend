import { Link } from "react-router-dom";

function EmptyState() {
  return (
    <div className="empty-state">
      <h2>No tasks yet</h2>
      <p>You have not created any tasks. Add your first task to get started.</p>

      <Link to="/add-task" className="empty-state-btn">
        Add Task
      </Link>
    </div>
  );
}

export default EmptyState;