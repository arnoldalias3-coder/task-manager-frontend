import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>Task Manager</h2>

      <div style={styles.links}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={styles.link}>
              Dashboard
            </Link>

            <Link to="/tasks" style={styles.link}>
              Tasks
            </Link>

            <Link to="/add-task" style={styles.link}>
              Add Task
            </Link>

            <Link to="/profile" style={styles.link}>
              Profile
            </Link>

            <div style={styles.avatar}>{initials}</div>

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>

            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#111827",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  logoutBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#ef4444",
    color: "white",
    cursor: "pointer",
  },
};

export default Navbar;