import React, { useState } from "react";
import { Base_URL } from "../Config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message
  const [user, setUser] = useState(null); // To store user data including online status

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setError(""); // Reset any previous errors
      setSuccess(""); // Reset any previous success messages
  
      const res = await axios.post(`${Base_URL}/login`, formData);
      const { token, user } = res.data;
  
      // Save token and user info to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);  // Save the userId from the response
      localStorage.setItem("user", JSON.stringify(user));

      // Set success message
      setSuccess("Login successful!");
      setUser(user); // Store user information in state including online status
  
      // Redirect to dashboard after success
      setTimeout(() => {
        navigate("/dashboard"); // Redirect to dashboard after a short delay
      }, 1000); // 1 second delay to show the success message
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg); // Display any error from the server
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>} {/* Success message */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>

        {/* Show user status if available */}
        {user && user.online && (
          <p style={styles.success}>You are online!</p>
        )}
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  form: {
    width: "300px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column"
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    fontSize: "16px"
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#2e89ff",
    color: "white",
    border: "none",
    borderRadius: "5px"
  },
  error: {
    color: "red",
    fontSize: "14px"
  },
  success: {
    color: "green",
    fontSize: "14px"
  }
};

export default Login;
