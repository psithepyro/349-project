import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    age: "",
    location: "",
  });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch(
      "https://6815a40d32debfe95dbc066e.mockapi.io/api/soccer/user", //replace key
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    const data = await res.json();
    if (res.ok) {
      console.log("User created: " + data.username);
      navigate("/fan-cards"); //navigate to main page
    } else {
      alert("signup failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">Sign Up</div>
      <form className="login-box" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          required
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Full Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          required
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          required
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <button className="login-btn" type="submit">
          Create Account
        </button>
        <button
          className="signup-btn"
          type="button"
          onClick={() => navigate("/login")}
        >
          Already have an account? Log in
        </button>
      </form>
    </div>
  );
}
