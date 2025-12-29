import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [error, setError] = useState("");

  const loadUsers = async (pageToLoad = page) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/users?page=${pageToLoad}`);
      setUsers(res.data.data);
      setMeta(res.data.meta);
      setPage(pageToLoad);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure to ${status} this user?`)) return;
    try {
      await api.patch(`/users/${id}/status`, { status });
      loadUsers(page);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update status");
    }
  };

  useEffect(() => {
    loadUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.fullName}</td>
                  <td>
                    <span
                      style={{
                        ...styles.role,
                        background: u.role === "admin" ? "#fde68a" : "#bfdbfe",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        ...styles.status,
                        background: u.status === "active" ? "#dcfce7" : "#fee2e2",
                        color: u.status === "active" ? "#166534" : "#991b1b",
                      }}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.status === "active" ? (
                      <button
                        style={styles.deactivateBtn}
                        onClick={() => updateStatus(u.id, "inactive")}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        style={styles.activateBtn}
                        onClick={() => updateStatus(u.id, "active")}
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
            <button disabled={page <= 1} onClick={() => loadUsers(page - 1)}>
              Prev
            </button>
            <span>
              Page {page} of {meta.totalPages}
            </span>
            <button
              disabled={page >= (meta.totalPages || 1)}
              onClick={() => loadUsers(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  container: {
    padding: "30px",
    background: "#f8fafc",
    minHeight: "90vh",
  },
  title: {
    marginBottom: "20px",
    color: "#0f172a",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  role: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  activateBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deactivateBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
