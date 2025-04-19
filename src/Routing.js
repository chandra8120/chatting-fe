import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


// Lazy imports
const Chat = lazy(() => import("./chat/Chat"));
const Dashboard = lazy(() => import("./Dashboard"));
const VideoCall = lazy(() => import("./video-call/Video"));
const UserList = lazy(() => import("./user-list/UserList"));
const Login = lazy(() => import("./Login/Login"));

function Routing() {
  const { userId } = useAuth();

  const ProtectedRoute = ({ children }) => {
    return userId ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <h2>Chat + Video Call App</h2>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          {userId && (
            <>
              <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
              <Link to="/chat" style={{ marginRight: "10px" }}>Chat</Link>
              <Link to="/video-call" style={{ marginRight: "10px" }}>Video Call</Link>
              <Link to="/userlist">User List</Link>
            </>
          )}
        </nav>

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/video-call" element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            } />
            <Route path="/userlist" element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to={userId ? "/dashboard" : "/login"} />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default Routing;
