import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Layout from "./layout/Layout";
import Dashboard from "./dashboard/Dashboard";
import "./Main.scss";
const ENDPOINT = "http://127.0.0.1:5000/";

export default function Main() {
  const [socket, setSocket] = useState(undefined);
  const [connectedUsers, setConnectedUser] = useState({});

  // socket listener

  const [user, setUser] = useState({
    connected: false,
    joined: false,
    auth: true,
    username: "",
    sid: "",
  });

  // set username. Setting username will display also the submit button

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.id]: e.target.value,
    });
  };

  // join function will assign a username and a id and set your status as connected on the server

  const join = (e) => {
    e.preventDefault();
    socket.emit("join", { user }, (data) => {
      console.log(data);
    });
  };

  // sockets event listeners

  useEffect(() => {
    if (user.connected) {
      console.log("Connection established", user);
      socket.on("disconnect", (data) => {
        console.log("someone disconnected ", data);
        setConnectedUser({ ...connectedUsers, ...data.connected_users });
      });
      socket.on("error", (data) => {
        console.log("there was an error: ", data);
      });
      socket.on("joined", (data) => {
        console.log("Someone Joined", data);
        setConnectedUser({ ...connectedUsers, ...data.connected_users });
      });
    }
  }, [user.connected]);

  // set connected to true triggering the socket event listeners

  useEffect(() => {
    if (socket) {
      socket.on("connected", (data) => {
        if (data) {
          setUser({
            ...user,
            connected: true,
            sid: data.sid,
          });
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    console.log("Instanciating socket");
    setSocket(io.connect(ENDPOINT, { reconnection: true }));
  }, []);

  return (
    <Layout>
      <div>
        <form>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={handleChange}
            placeholder="username"
          />
          {user.username && (
            <input type="submit" value="connect" onClick={join} />
          )}
        </form>
      </div>
      {Object.keys(connectedUsers).length > 0 && (
        <Dashboard
          connectedUsers={connectedUsers}
          socket={socket}
          user={user}
        />
      )}
    </Layout>
  );
}
