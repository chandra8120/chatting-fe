// import React, { useEffect, useRef, useState } from "react";
// import './video.css'
// import Peer from "simple-peer";
// import socket from "../Socket";

// const VideoCall = ({ userId, receiverId }) => {
//   const [stream, setStream] = useState(null);
//   const [callAccepted, setCallAccepted] = useState(false);
//   const [callStarted, setCallStarted] = useState(false);

//   const myVideo = useRef();
//   const userVideo = useRef();
//   const peerRef = useRef();

//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
//       setStream(currentStream);
//       if (myVideo.current) myVideo.current.srcObject = currentStream;
//     });

//     socket.on("incoming-call", ({ from, signal }) => {
//       const peer = new Peer({ initiator: false, trickle: false, stream });
//       peer.on("signal", (signal) => {
//         socket.emit("answer-call", { signal, to: from });
//       });
//       peer.on("stream", (remoteStream) => {
//         if (userVideo.current) userVideo.current.srcObject = remoteStream;
//       });

//       peer.signal(signal);
//       peerRef.current = peer;
//       setCallAccepted(true);
//     });

//     socket.on("call-accepted", ({ signal }) => {
//       setCallAccepted(true);
//       peerRef.current.signal(signal);
//     });
//   }, [stream]);

//   const startCall = () => {
//     setCallStarted(true);
//     const peer = new Peer({ initiator: true, trickle: false, stream });

//     peer.on("signal", (signal) => {
//       socket.emit("call-user", { to: receiverId, signalData: signal, from: userId });
//     });

//     peer.on("stream", (remoteStream) => {
//       if (userVideo.current) userVideo.current.srcObject = remoteStream;
//     });

//     peerRef.current = peer;
//   };

//   return (
//     <div className="video-call-container">
//       <div>
//         <video ref={myVideo} autoPlay muted className="video-box" />
//         <p>You</p>
//       </div>

//       <div>
//         <video ref={userVideo} autoPlay className="video-box" />
//         <p>{receiverId}</p>
//       </div>

//       {!callStarted && !callAccepted && (
//         <button onClick={startCall} className="start-call-btn">📞 Start Call</button>
//       )}
//     </div>
//   );
// };

// export default VideoCall;
import React from 'react'

const Video = () => {
  return (
    <div>
      
    </div>
  )
}

export default Video
