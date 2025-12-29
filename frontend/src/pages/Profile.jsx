/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./Profile.css"; // Import the CSS file

const passwordRule = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function Profile() {
  const { user: ctxUser, refreshUser } = useContext(AuthContext);
  const [user, setUser] = useState({ fullName: "", email: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setError("Unable to load profile");
      }
    };
    fetchUser();
  }, [ctxUser]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await api.put("/users/me", {
        fullName: user.fullName,
        email: user.email,
      });
      setMsg("Profile updated successfully");
      refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    const { currentPassword, newPassword, confirmPassword } = e.target;

    if (newPassword.value !== confirmPassword.value) {
      return setError("New passwords do not match");
    }
    if (!passwordRule.test(newPassword.value)) {
      return setError(
        "Password must be 8+ chars with upper, lower, number, and special character"
      );
    }

    try {
      await api.patch("/users/me/password", {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      });
      setMsg("Password updated successfully");
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Password update failed");
    }
  };

  const onFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      {msg && <p className="msg success">{msg}</p>}
      {error && <p className="msg error">{error}</p>}

      <form className="profile-form" onSubmit={updateProfile}>
        <label>Full Name</label>
        <input
          name="fullName"
          value={user.fullName || ""}
          onChange={onFieldChange}
          required
          placeholder="Enter your full name"
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={user.email || ""}
          onChange={onFieldChange}
          required
          placeholder="Enter your email"
        />

        <button type="submit" className="btn">Save Changes</button>
      </form>

      <h3 className="section-title">Change Password</h3>
      <form className="profile-form" onSubmit={changePassword}>
        <label>Current Password</label>
        <input
          name="currentPassword"
          type="password"
          placeholder="Current password"
          required
        />

        <label>New Password</label>
        <input
          name="newPassword"
          type="password"
          placeholder="New password"
          required
        />

        <label>Confirm New Password</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          required
        />

        <button type="submit" className="btn">Update Password</button>
      </form>
    </div>
  );
}
