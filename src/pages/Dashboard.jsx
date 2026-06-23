import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");
        setLoading(true);

        const userRes = await axiosInstance.get("/auth/me");
        setUser(userRes.data.user);

        const tasksRes = await axiosInstance.get("/tasks");

        if (Array.isArray(tasksRes.data)) {
          setTasks(tasksRes.data);
        } else if (Array.isArray(tasksRes.data.tasks)) {
          setTasks(tasksRes.data.tasks);
        } else {
          setTasks([]);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            `Dashboard failed. Status: ${err.response?.status || "unknown"}`
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high"
  ).length;

  return (
    <div style={styles.page}>
      <h1>Dashboard</h1>

      {error && <div style={styles.error}>{error}</div>}

      {user && (
        <div style={styles.welcomeCard}>
          <h2>Welcome, {user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}

      {loading ? (
        <div className="spinner-container">
          <div className="large-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>

          <div style={styles.card}>
            <h3>Pending</h3>
            <p>{pendingTasks}</p>
          </div>

          <div style={styles.card}>
            <h3>Completed</h3>
            <p>{completedTasks}</p>
          </div>

          <div style={styles.card}>
            <h3>High Priority</h3>
            <p>{highPriorityTasks}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "40px",
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
  },
  welcomeCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "25px",
  },
};

export default Dashboard;