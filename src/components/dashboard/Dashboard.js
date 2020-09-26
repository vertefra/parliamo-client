import React, { useEffect, useState } from "react";
import TextArea from "./TextArea";
import BrowserRouter, { Router } from "react-router-dom";

export default function Dashboard(props) {
  const { user } = props;
  const [friend, setFriend] = useState({
    username: "",
    sid: "",
  });

  const establishConnection = (e) => {
    const amigo = props.connectedUsers[e.target.id];
    setFriend(amigo);
  };

  return (
    <div id="dashboard">
      <ul className="onlineUsers">
        <h1>online now:</h1>
        {Object.keys(props.connectedUsers).map((sid) => {
          return (
            <li key={sid}>
              <div
                className="userButton"
                id={sid}
                name={props.connectedUsers[sid].username}
                onClick={establishConnection}
              >
                {props.connectedUsers[sid].username}
              </div>
            </li>
          );
        })}
      </ul>
      {friend.sid && user.sid !== friend.sid && (
        <TextArea friend={friend} socket={props.socket} />
      )}
    </div>
  );
}
