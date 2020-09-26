import React, { useEffect, useState } from "react";
import TextArea from "./TextArea";

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
        <h1>Hello {user.username}!</h1>
        <h1>online now:</h1>
        {Object.keys(props.connectedUsers).map((sid) => {
          if (sid !== user.sid)
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
      <TextArea friend={friend} socket={props.socket} />
    </div>
  );
}
