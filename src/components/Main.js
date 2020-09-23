import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000/";
// const socket = io.connect(ENDPOINT, { reconnection: true });

export default function Main() {
  const [user, setUser] = useState({
    username: "",
    sid: "",
  });

  const handleChange = (e) => {
    setUser({
      [e.target.id]: e.target.value,
      ...user.sid,
    });
  };

  const connect = (e) => {
    e.preventDefault();
    const private_socket = io.connect(ENDPOINT, { reconnection: true });
    private_socket.emit("connect");
    private_socket.on("connected", (data) => {
      setUser({
        ...user,
        sid: data.sid,
      });
      private_socket.emit("join", { user });
    });
    // private_socket.emit("join", { user });
    // private_socket.on("connection_established", (data) => {
    //   console.log(data);
    // });
  };

  // established first connection and get session id

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <div>
      <form>
        <input
          type="text"
          id="username"
          value={user.username}
          onChange={handleChange}
          placeholder="username"
        />
        <input type="submit" value="connect" onClick={connect} />
      </form>
    </div>
  );
}
