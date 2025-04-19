import React, { useState, useEffect } from "react";
import { Base_URL } from "../Config";
import Avatar from "@mui/material/Avatar";
import "./userlist.css";
import Chat from "../chat/Chat";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${Base_URL}/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
    const userId = localStorage.getItem("userId");
    setLoggedInUser(userId);
  }, []);


  
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="chat-app-container">
      <div className="sidebar">
        <h2 className="title">Chats</h2>
        <input
          type="text"
          placeholder="Search or start a new chat"
          className="search-box"
        />
        <ul className="user-list">
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`user-item ${selectedUser?._id === user._id ? "selected" : ""}`}
            >
              <Avatar
                alt={user.username}
                src={user.profileImage || "/default-avatar.png"}
                sx={{ width: 48, height: 48, marginRight: "12px", fontSize: "20px" }}
              >
                {!user.profileImage && user.username?.charAt(0).toUpperCase()}
              </Avatar>

              <div className="user-info">
                <div className="user-name">
                  {user.username}
                  {user._id === loggedInUser && " (You)"}
                </div>
                <div className="last-message">Image</div>
              </div>

              {/* Displaying green circle if user is online */}
              {user.online && (
                <div className="online-indicator"></div>
              )}

              <div className="time-stamp">Yesterday</div>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && loggedInUser && (
        <div className="chat-section">
          <div className="chat-header">{selectedUser.username}</div>
          <Chat userId={loggedInUser} receiverId={selectedUser._id} />
        </div>
      )}
    </div>
  );
};

export default UserList;
