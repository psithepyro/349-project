import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function LoginForm() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `https://6815a40d32debfe95dbc066e.mockapi.io/api/soccer/user?username=${credentials.username}&password=${credentials.password}`
    );
    const users = await res.json();
    const user = users.find((u) => u.password === credentials.password);

    if (user) {
      alert("Login successful!");
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      navigate("/fan-cards");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">Log In</div>
      <form className="login-box" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          required
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button className="login-btn" type="submit">
          Login
        </button>
        <button
          className="signup-btn"
          type="button"
          onClick={() => navigate("/")}
        >
          Don’t have an account? Sign Up
        </button>
      </form>
    </div>
  );
}
