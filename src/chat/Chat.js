import React, { useState, useEffect, useRef } from "react";
import {Base_URL} from '../Config'
import socket from "../Socket";
import SimplePeer from "simple-peer"; // Import SimplePeer for WebRTC
import "./chat.css";

const Chat = ({ userId, receiverId }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false); // Track video call state
  const [peer, setPeer] = useState(null); // Store peer connection
  const localVideoRef = useRef(null); // Reference for local video
  const remoteVideoRef = useRef(null); // Reference for remote video

  useEffect(() => {
    if (!userId || !receiverId) return;

    // Join the chat room with the unique room for this user pair
    socket.emit("join", { senderId: userId, receiverId });

    // Fetch existing messages
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(
          `${Base_URL}/api/messages?sender=${userId}&receiver=${receiverId}`
        );
        const data = await res.json();
        setChat(data);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
    };

    fetchChatHistory();

    // Listen for new messages
    const onMessage = ({ sender, content }) => {
      setChat((prev) => [...prev, { sender, content }]);
    };

    socket.on("chat-message", onMessage);

    return () => {
      socket.off("chat-message", onMessage);
    };
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (!message.trim()) {
      console.log("⚠️ Message is empty. Not sending.");
      return;
    }

    console.log("✉️ Sending message:", message);
    socket.emit("chat-message", { sender: userId, receiver: receiverId, content: message });
    setChat((prev) => [...prev, { sender: "You", content: message }]);
    setMessage("");
  };

  // Function to handle video call initiation
  const startVideoCall = () => {
    setIsVideoCallActive(true);
    const peer = new SimplePeer({ initiator: true, trickle: false });

    peer.on("signal", (data) => {
      socket.emit("offer", { to: receiverId, data });
    });

    peer.on("stream", (stream) => {
      remoteVideoRef.current.srcObject = stream;
    });

    // Get user media (local video and audio)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        peer.addStream(stream);
      })
      .catch((err) => {
        console.error("Error accessing media devices.", err);
      });

    setPeer(peer);
  };

  // Handle the incoming offer from the other user
  useEffect(() => {
    socket.on("offer", (data) => {
      const peer = new SimplePeer({ initiator: false, trickle: false });

      peer.on("signal", (signalData) => {
        socket.emit("answer", { to: receiverId, data: signalData });
      });

      peer.on("stream", (stream) => {
        remoteVideoRef.current.srcObject = stream;
      });

      // Get user media (local video and audio)
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          peer.addStream(stream);
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });

      setPeer(peer);
    });

    return () => {
      socket.off("offer");
    };
  }, [receiverId]);

  // Function to end the video call
  const endVideoCall = () => {
    if (peer) {
      peer.destroy(); // Destroy the peer connection
    }
    setIsVideoCallActive(false); // Reset video call state
    setPeer(null); // Reset peer connection
  };

  return (
    <div className="chat-container">
      <h3 className="chat-title">💬 Chat with {receiverId}</h3>

      {/* Video call button */}
      <button
        onClick={startVideoCall}
        className="video-call-button"
        disabled={isVideoCallActive}
      >
        📹 Start Video Call
      </button>

      {/* Video call controls */}
      {isVideoCallActive && (
        <div className="video-call-container">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="local-video"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            className="remote-video"
          />
          <button onClick={endVideoCall} className="end-call-button">
            End Call
          </button>
        </div>
      )}

      {/* Chat messages */}
      <div className="chat-messages">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.sender === "You" || msg.sender === userId ? "sent" : "received"
            }`}
          >
            <div className="sender-name">
              {msg.sender === "You" || msg.sender === userId ? "You" : "Other"}
            </div>
            <div className="message-text">{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
