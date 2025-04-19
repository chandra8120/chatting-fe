import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");

    // Call the backend to mark the user as offline
    try {
      await fetch("http://localhost:4000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      // Clear user data from localStorage
      localStorage.clear();

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to Dashboard</h1>
      <p>You are now logged in.</p>
      <div style={styles.buttons}>
        <button onClick={() => navigate("/chat")} style={styles.btn}>
          Go to Chat
        </button>
        <button onClick={() => navigate("/video-call")} style={styles.btn}>
          Go to Video Call
        </button>
        <button onClick={() => navigate("/userlist")} style={styles.btn}>
          Go to User List
        </button>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    gap: "15px",
    justifyContent: "center",
  },
  btn: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #007bff",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid red",
    backgroundColor: "red",
    color: "white",
    cursor: "pointer",
  },
};

export default Dashboard;
