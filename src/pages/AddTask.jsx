import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";

function AddTask() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    category: "Work",
    dueDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      toast.error("Title is required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await axiosInstance.post("/tasks", {
        ...formData,
        dueDate: formData.dueDate || null,
      });

      toast.success("Task added successfully");
      navigate("/tasks");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add task";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Add New Task</h2>

        {error && <p style={styles.error}>{error}</p>}

        <label style={styles.label}>Title</label>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          placeholder="Task description"
          value={formData.description}
          onChange={handleChange}
          style={styles.textarea}
        />

        <label style={styles.label}>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <label style={styles.label}>Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label style={styles.label}>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>

        <label style={styles.label}>Due Date</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          style={styles.input}
        />

        <button
          type="submit"
          style={loading ? styles.disabledButton : styles.button}
          disabled={loading}
        >
          {loading && <span className="button-spinner"></span>}
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "430px",
    padding: "25px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginTop: 0,
    color: "#0f172a",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "6px",
    color: "#0f172a",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    marginBottom: "12px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    marginBottom: "12px",
    minHeight: "90px",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  disabledButton: {
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#93c5fd",
    color: "white",
    cursor: "not-allowed",
    fontSize: "15px",
    fontWeight: "bold",
    marginTop: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px",
  },
};

export default AddTask;
