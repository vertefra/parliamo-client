import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Layout from "./layout/Layout";
import Dashboard from "./dashboard/Dashboard";
import "./Main.scss";
import axios from "axios";
import { chat_server, albert_auth_server } from "../config";

export default function Main() {
  const [socket, setSocket] = useState(undefined);
  const [connectedUsers, setConnectedUser] = useState({});
  const [signUpUsername, setSignUpUsername] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({
    connected: false,
    joined: false,
    auth: true,
    username: "",
    sid: "",
  });

  // const handleChange = (e) => {
  //   setUser({
  //     ...user,
  //     [e.target.id]: e.target.value,
  //   });
  // };

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${albert_auth_server}/signup`, {
        signUpUsername,
      });
      if (resp) {
        join();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // join function will assign a username and a id and set your status as connected on the server

  const join = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${albert_auth_server}/join`, { username });
      console.log(resp);
    } catch (err) {
      console.log(err);
    }
  };

  // sockets event listeners

  useEffect(() => {
    console.log(
      "IF YOU SEE MORE THAN 2 TIMES THIS MESSAGE SOMETHING IS WRONG WITH THE USE EFFECT FOR SOCKET IO"
    );
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
        if (user.joined === false) {
          console.log("Someone Joined", data);
          setConnectedUser({ ...connectedUsers, ...data.connected_users });
        }
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
    setSocket(io.connect(chat_server, { reconnection: true }));
  }, []);

  return (
    <Layout>
      <div className="main">
        <form>
          <label htmlFor="username">Sign up with existing email</label>
          <input
            className="primary-inp"
            type="email"
            id="username"
            value={signUpUsername}
            onChange={(e) => setSignUpUsername(e.target.value)}
            placeholder="username"
          />
          {signUpUsername && (
            <input
              className="primary-btn"
              type="submit"
              value="connect"
              onClick={signUp}
            />
          )}
          <label htmlFor="join">join with your email</label>
          <input
            className="primary-inp"
            type="email"
            id="join"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          {username && (
            <input
              className="primary-btn"
              type="submit"
              value="connect"
              onClick={join}
            />
          )}
        </form>
        <div className="brand">
          <img src="/assets/logo.png" />
        </div>
        <button className="primary-btn">disconnect</button>
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
