import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = e.target;

    if (password.value !== confirmPassword.value) {
      return setError("Passwords do not match");
    }

    if (!passwordRule.test(password.value)) {
      return setError(
        "Password must be 8+ chars with upper, lower, number, and special character"
      );
    }

    try {
      await api.post("/auth/signup", {
        fullName: fullName.value,
        email: email.value,
        password: password.value,
      });
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err.response || err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Server error"
      );
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-card" onSubmit={submit}>
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <input name="fullName" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
        />

        <button type="submit">Sign Up</button>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
