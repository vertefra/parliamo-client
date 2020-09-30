import { chat_server, albert_auth_server } from "../config";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

import Dashboard from "./dashboard/Dashboard";
import Layout from "./layout/Layout";
import "./Main.scss";

export default function Main() {
  const [socket, setSocket] = useState(undefined);
  const [connectedUsers, setConnectedUser] = useState({});
  const [signUpUsername, setSignUpUsername] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    connected: false,
    joined: false,
    auth: true,
    username: "",
    sid: "",
  });

  const closeError = (e) => {
    e.preventDefault();
    setError("");
  };

  const signUp = async (e) => {
    e.preventDefault();
    if (signUpUsername.includes("@")) {
      try {
        const resp = await axios.post(`${albert_auth_server}/signup`, {
          username: signUpUsername,
          sid: user.sid,
        });
        if (resp) {
          try {
            const resp = await axios.post(`${albert_auth_server}/join`, {
              username: signUpUsername,
              sid: user.sid,
            });
            setUser({
              ...user,
              username: resp.data.username,
              joined: true,
            });
            setUsername("");
            setSignUpUsername("");
          } catch (err) {
            setError(err);
            setUsername("");
            setSignUpUsername("");
          }
        }
      } catch (err) {
        setError("Is the email already in use?");
        setUsername("");
        setSignUpUsername("");
      }
    } else {
      setError("invalid email address!");
      setUsername("");
      setSignUpUsername("");
    }
  };

  // join function will assign a username and a id and set your status as connected on the server

  const join = async (e) => {
    console.log(user);
    e.preventDefault();
    try {
      const resp = await axios.post(`${albert_auth_server}/join`, {
        username,
        sid: user.sid,
      });
      console.log(resp.data);
      if (resp) {
        setUser({
          ...user,
          username: resp.data.username,
          joined: true,
        });
        // socket.emit("join", { user });
      }
    } catch (err) {
      setError("Login Failed. Did you Sign up already?");
    }
    setUsername("");
    setSignUpUsername("");
  };

  const disconnect = (e) => {
    e.preventDefault();
    socket.disconnect(`${chat_server}`);
    setUser({
      connected: false,
      joined: false,
      auth: true,
      username: "",
      sid: "",
    });
    socket.off("connected");
    window.location.reload();
  };

  // sockets event listeners

  useEffect(() => {
    console.log(
      "IF YOU SEE MORE THAN 2 TIMES THIS MESSAGE SOMETHING IS WRONG WITH THE USE EFFECT FOR SOCKET IO"
    );
    if (user.connected) {
      socket.on("disconnect", (data) => {
        setConnectedUser({ ...connectedUsers, ...data.connected_users });
      });

      socket.on("error", (data) => {
        setError(data);
      });

      socket.on("joined", (data) => {
        console.log(data);
        if (user.joined === false) {
          setConnectedUser({ ...connectedUsers, ...data.connected_users });
        }
      });
    }
  }, [user.connected]);

  // set connected to true triggering the socket event listeners

  useEffect(() => {
    if (socket) {
      socket.on("connected", (data) => {
        console.log(data);
        if (data) {
          setUser({
            ...user,
            connected: true,
            sid: data.sid,
          });
        }
      });
    }
  }, [socket, user]);

  useEffect(() => {
    console.log("Instanciating socket");
    setSocket(io.connect(chat_server, { reconnection: true }));
  }, []);

  // join event is triggered when receive the positive response from the authentication server
  // in the join function and set username and sid

  // useEffect(() => {
  //   if (user.username) {
  //     socket.emit("join", { user });
  //   }
  // }, [user.username, socket, user]);

  return (
    <Layout>
      <div className="main">
        <form>
          {!user.joined ? (
            <>
              <div className="formField">
                <label htmlFor="username">Signup</label>
                <input
                  className="primary-inp"
                  type="email"
                  id="username"
                  value={signUpUsername}
                  onChange={(e) => {
                    setSignUpUsername(e.target.value);
                    setUsername("");
                  }}
                  placeholder="username"
                  autoComplete="off"
                />
              </div>
              <div className="formField">
                <label htmlFor="join">Login</label>
                <input
                  className="primary-inp"
                  type="email"
                  id="join"
                  value={username}
                  onChange={(e) => {
                    setSignUpUsername("");
                    setUsername(e.target.value);
                  }}
                  placeholder="username"
                  autoComplete="off"
                />
              </div>
            </>
          ) : null}

          {/* comunications and hide/appear buttons */}
          {/* error comunications */}

          <div className="hidingBtn">
            {error && (
              <div className="alert">
                <button className="primary-btn" onClick={closeError}>
                  x
                </button>
                <p>{error}</p>
              </div>
            )}

            {/* login button */}

            {username && !error && (
              <input
                className="primary-btn"
                type="submit"
                value="login"
                onClick={join}
              />
            )}

            {/* signUp button  */}

            {signUpUsername && !error && (
              <input
                className="primary-btn"
                type="submit"
                value="signup"
                onClick={signUp}
              />
            )}

            {/* disconnect button  */}

            {user.joined && !error && (
              <button className="primary-btn disconnect" onClick={disconnect}>
                disconnect
              </button>
            )}
          </div>

          {/* end */}
        </form>
        {!user.joined && (
          <div className="brand">
            <img src="/assets/logo.png" alt="logo" />
          </div>
        )}
      </div>
      <div id="dashboard">
        {Object.keys(connectedUsers).length > 0 && user.joined && (
          <Dashboard
            errorControllers={[error, setError]}
            connectedUsers={connectedUsers}
            socket={socket}
            user={user}
          />
        )}
      </div>
    </Layout>
  );
}
