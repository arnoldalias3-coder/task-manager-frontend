import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      setError("");
      setLoading(true);

      const res = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const token = res.data.token;

      if (!token) {
        throw new Error("No token received from backend");
      }

      login(token,res.data.user);

      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);

      const message =
        err.response?.data?.message || err.message || "Login failed";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading && <span className="button-spinner"></span>}
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Do not have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;