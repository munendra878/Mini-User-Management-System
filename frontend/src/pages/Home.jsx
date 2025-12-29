import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Mini User Management App</h1>
      <p>Please login or signup to continue</p>

      <div className="home-buttons">
        <Link to="/login" className="btn login-btn">
          Login
        </Link>

        <Link to="/signup" className="btn signup-btn">
          Signup
        </Link>
      </div>
    </div>
  );
}
