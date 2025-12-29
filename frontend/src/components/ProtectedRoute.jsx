import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { token, user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;
  if (!token) return <Navigate to="/login" replace />;

  let effectiveRole = user?.role;
  if (!effectiveRole) {
    try {
      effectiveRole = jwtDecode(token).role;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }
  if (role && effectiveRole !== role) return <Navigate to="/login" replace />;

  return children;
}
