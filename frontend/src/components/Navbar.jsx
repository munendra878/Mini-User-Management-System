import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Navbar() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    }
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>Mini User Management System</div>

      <div style={styles.links}>
        <Link style={styles.link} to="/">Home</Link>

        {!token && (
          <>
            <Link style={styles.link} to="/login">User Login</Link>
            <Link style={styles.adminBtn} to="/admin-login">
              Admin Login
            </Link>
          </>
        )}

        {token && (
          <>
            <span style={styles.userBadge}>
              {user?.fullName || "User"} ({user?.role})
            </span>

            {user?.role === "admin" ? (
              <Link style={styles.adminLink} to="/admin">
                Admin Dashboard
              </Link>
            ) : (
              <>
                <Link style={styles.link} to="/dashboard">Dashboard</Link>
                <Link style={styles.link} to="/profile">Profile</Link>
              </>
            )}

            <button onClick={signOut} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

/* 🎨 Styles */
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 25px",
    backgroundColor: "#0f172a", // dark navy
    color: "#fff",
  },
  logo: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#38bdf8",
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "14px",
  },
  signupBtn: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    textDecoration: "none",
  },
  adminBtn: {
    backgroundColor: "#6366f1",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "14px",
  },
  adminLink: {
    color: "#facc15",
    fontWeight: "bold",
    textDecoration: "none",
  },
  userBadge: {
    color: "#e5e7eb",
    fontSize: "13px",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
