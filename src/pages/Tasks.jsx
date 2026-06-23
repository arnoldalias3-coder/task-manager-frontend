import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";

const CATEGORY_OPTIONS = ["Work", "Personal", "Study"];

const formatDateForInput = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const formatDateForDisplay = (date) => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString();
};

const getTaskId = (task) => task._id || task.id;

const getPriorityBadgeStyle = (priority) => {
  if (priority === "high") {
    return {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
    };
  }

  if (priority === "medium") {
    return {
      backgroundColor: "#fef3c7",
      color: "#ca8a04",
    };
  }

  return {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  };
};

const getStatusBadgeStyle = (status) => {
  if (status === "completed") {
    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
    };
  }

  return {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  };
};

const getCategoryBadgeStyle = (category) => {
  if (category === "Personal") {
    return {
      backgroundColor: "#fce7f3",
      color: "#be185d",
    };
  }

  if (category === "Study") {
    return {
      backgroundColor: "#ede9fe",
      color: "#6d28d9",
    };
  }

  return {
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
  };
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editingTaskId, setEditingTaskId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    category: "Work",
    dueDate: "",
  });

  const fetchTasks = async (showLoader = false) => {
    try {
      setError("");
      if (showLoader) setPageLoading(true);

      const res = await axiosInstance.get("/tasks");

      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load tasks";
      setError(message);
      toast.error(message);
    } finally {
      if (showLoader) setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(true);
  }, []);

  const totalCount = tasks.length;
  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const highPriorityCount = tasks.filter((task) => task.priority === "high").length;

  const filteredTasks = tasks.filter((task) => {
    const title = task.title || "";
    const taskCategory = task.category || "Work";

    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesMainFilter =
      activeFilter === "all" ||
      task.status === activeFilter ||
      (activeFilter === "high" && task.priority === "high");

    const matchesCategory =
      categoryFilter === "all" || taskCategory === categoryFilter;

    return matchesSearch && matchesMainFilter && matchesCategory;
  });

  const startEdit = (task) => {
    setEditingTaskId(getTaskId(task));

    setEditForm({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "pending",
      priority: task.priority || "medium",
      category: task.category || "Work",
      dueDate: formatDateForInput(task.dueDate),
    });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);

    setEditForm({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      category: "Work",
      dueDate: "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveEdit = async (taskId) => {
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setError("");
      setSavingId(taskId);

      const res = await axiosInstance.put(`/tasks/${taskId}`, {
        ...editForm,
        dueDate: editForm.dueDate || null,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) => (getTaskId(task) === taskId ? res.data : task))
      );

      setEditingTaskId(null);
      toast.success("Task updated successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task";
      setError(message);
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) return;

    try {
      setError("");
      setDeletingId(taskId);

      await axiosInstance.delete(`/tasks/${taskId}`);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => getTaskId(task) !== taskId)
      );

      toast.success("Task deleted successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete task";
      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleComplete = async (task) => {
    const taskId = getTaskId(task);
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      setError("");
      setTogglingId(taskId);

      const res = await axiosInstance.patch(`/tasks/${taskId}`, {
        status: newStatus,
      });

      setTasks((prevTasks) =>
        prevTasks.map((item) =>
          getTaskId(item) === taskId ? { ...item, status: res.data.status } : item
        )
      );

      toast.success(
        newStatus === "completed" ? "Task marked completed" : "Task marked pending"
      );
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task status";
      setError(message);
      toast.error(message);
    } finally {
      setTogglingId(null);
    }
  };

  if (pageLoading) {
    return (
      <div style={styles.page}>
        <div className="spinner-container">
          <div className="page-spinner"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Tasks</h1>
          <p style={styles.subtitle}>
            Manage, search, filter, edit and update your tasks
          </p>
        </div>

        <Link to="/add-task" style={styles.addBtn}>
          Add Task
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <input
        type="text"
        placeholder="Search tasks by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      <div style={styles.filterRow}>
        <button
          onClick={() => setActiveFilter("all")}
          style={activeFilter === "all" ? styles.activeFilterBtn : styles.filterBtn}
        >
          All ({totalCount})
        </button>

        <button
          onClick={() => setActiveFilter("pending")}
          style={activeFilter === "pending" ? styles.activeFilterBtn : styles.filterBtn}
        >
          Pending ({pendingCount})
        </button>

        <button
          onClick={() => setActiveFilter("completed")}
          style={activeFilter === "completed" ? styles.activeFilterBtn : styles.filterBtn}
        >
          Completed ({completedCount})
        </button>

        <button
          onClick={() => setActiveFilter("high")}
          style={activeFilter === "high" ? styles.activeFilterBtn : styles.filterBtn}
        >
          High Priority ({highPriorityCount})
        </button>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.categoryFilter}
        >
          <option value="all">All Categories</option>
          {CATEGORY_OPTIONS.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <p style={styles.resultCount}>
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {filteredTasks.length === 0 ? (
        <div style={styles.emptyBox}>
          <p>No tasks found.</p>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => {
            const taskId = getTaskId(task);
            const status = task.status || "pending";
            const priority = task.priority || "medium";
            const category = task.category || "Work";

            return (
              <div key={taskId} style={styles.card}>
                {editingTaskId === taskId ? (
                  <>
                    <h2 style={styles.cardTitle}>Edit Task</h2>

                    <label style={styles.label}>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      style={styles.input}
                    />

                    <label style={styles.label}>Description</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      style={styles.textarea}
                    />

                    <label style={styles.label}>Status</label>
                    <select
                      name="status"
                      value={editForm.status}
                      onChange={handleEditChange}
                      style={styles.input}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>

                    <label style={styles.label}>Priority</label>
                    <select
                      name="priority"
                      value={editForm.priority}
                      onChange={handleEditChange}
                      style={styles.input}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    <label style={styles.label}>Category</label>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      style={styles.input}
                    >
                      {CATEGORY_OPTIONS.map((categoryOption) => (
                        <option key={categoryOption} value={categoryOption}>
                          {categoryOption}
                        </option>
                      ))}
                    </select>

                    <label style={styles.label}>Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                      style={styles.input}
                    />

                    <div style={styles.actions}>
                      <button
                        onClick={() => saveEdit(taskId)}
                        style={savingId === taskId ? styles.disabledBtn : styles.saveBtn}
                        disabled={savingId === taskId}
                      >
                        {savingId === taskId && (
                          <span className="button-spinner"></span>
                        )}
                        {savingId === taskId ? "Saving..." : "Save"}
                      </button>

                      <button
                        onClick={cancelEdit}
                        style={styles.cancelBtn}
                        disabled={savingId === taskId}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={styles.cardHeader}>
                      <h2 style={styles.cardTitle}>{task.title}</h2>
                      <span
                        style={{
                          ...styles.badge,
                          ...getStatusBadgeStyle(status),
                        }}
                      >
                        {status}
                      </span>
                    </div>

                    <p style={styles.description}>
                      {task.description || "No description"}
                    </p>

                    <div style={styles.infoRow}>
                      <strong>Priority:</strong>
                      <span
                        style={{
                          ...styles.badge,
                          ...getPriorityBadgeStyle(priority),
                        }}
                      >
                        {priority}
                      </span>
                    </div>

                    <div style={styles.infoRow}>
                      <strong>Category:</strong>
                      <span
                        style={{
                          ...styles.badge,
                          ...getCategoryBadgeStyle(category),
                        }}
                      >
                        {category}
                      </span>
                    </div>

                    <div style={styles.infoRow}>
                      <strong>Due Date:</strong>
                      <span>{formatDateForDisplay(task.dueDate)}</span>
                    </div>

                    <div style={styles.actions}>
                      <button
                        onClick={() => startEdit(task)}
                        style={styles.editBtn}
                        disabled={togglingId === taskId || deletingId === taskId}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => toggleComplete(task)}
                        style={
                          status === "completed"
                            ? styles.pendingToggleBtn
                            : styles.completeBtn
                        }
                        disabled={togglingId === taskId}
                      >
                        {togglingId === taskId && (
                          <span className="button-spinner"></span>
                        )}
                        {togglingId === taskId
                          ? "Updating..."
                          : status === "completed"
                          ? "Mark Pending"
                          : "Mark Completed"}
                      </button>

                      <button
                        onClick={() => deleteTask(taskId)}
                        style={deletingId === taskId ? styles.disabledDeleteBtn : styles.deleteBtn}
                        disabled={deletingId === taskId}
                      >
                        {deletingId === taskId && (
                          <span className="button-spinner"></span>
                        )}
                        {deletingId === taskId ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const baseBtn = {
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  fontWeight: "bold",
};

const disabledBtn = {
  ...baseBtn,
  backgroundColor: "#94a3b8",
  cursor: "not-allowed",
};

const styles = {
  page: {
    padding: "40px",
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    gap: "20px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: "8px",
    color: "#64748b",
  },
  addBtn: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    marginBottom: "18px",
    fontSize: "16px",
    outline: "none",
  },
  filterRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "12px",
    alignItems: "center",
  },
  filterBtn: {
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: "bold",
  },
  activeFilterBtn: {
    padding: "10px 14px",
    border: "1px solid #2563eb",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  categoryFilter: {
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: "bold",
  },
  resultCount: {
    color: "#64748b",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "flex-start",
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#0f172a",
  },
  description: {
    color: "#475569",
    marginBottom: "18px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
    color: "#0f172a",
  },
  badge: {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "6px",
    display: "block",
    color: "#0f172a",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    minHeight: "80px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "18px",
  },
  editBtn: {
    ...baseBtn,
    backgroundColor: "#2563eb",
  },
  completeBtn: {
    ...baseBtn,
    backgroundColor: "#16a34a",
  },
  pendingToggleBtn: {
    ...baseBtn,
    backgroundColor: "#ca8a04",
  },
  deleteBtn: {
    ...baseBtn,
    backgroundColor: "#dc2626",
  },
  saveBtn: {
    ...baseBtn,
    backgroundColor: "#16a34a",
  },
  cancelBtn: {
    ...baseBtn,
    backgroundColor: "#6b7280",
  },
  disabledBtn,
  disabledDeleteBtn: {
    ...disabledBtn,
    backgroundColor: "#fca5a5",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  emptyBox: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};

export default Tasks;
