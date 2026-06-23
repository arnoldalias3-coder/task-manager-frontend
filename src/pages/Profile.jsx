import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError("");
        setLoading(true);

        const res = await axiosInstance.get("/auth/me");

        setUser(res.data.user);
        setName(res.data.user.name || "");
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load profile";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setSaving(true);

      const res = await axiosInstance.put("/auth/me", {
        name: name.trim(),
      });

      setUser(res.data.user);
      setName(res.data.user.name);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Profile updated successfully");
      toast.success("Profile updated successfully");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to update profile";

      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div className="spinner-container">
          <div className="page-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Profile</h1>

        {user && (
          <div style={styles.infoBox}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <p>
              <strong>Member Since:</strong>{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Not available"}
            </p>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} style={styles.form}>
          <label style={styles.label}>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            placeholder="Enter your name"
            required
          />

          <button type="submit" style={styles.button} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {success && <p style={styles.success}>{success}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "500px",
    maxWidth: "100%",
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  title: {
    marginTop: 0,
    color: "#0f172a",
  },
  infoBox: {
    backgroundColor: "#f8fafc",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontWeight: "bold",
    color: "#0f172a",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  success: {
    color: "#16a34a",
    marginTop: "20px",
    fontWeight: "bold",
  },
  error: {
    color: "#dc2626",
    marginTop: "20px",
    fontWeight: "bold",
  },
};

export default Profile;