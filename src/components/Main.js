import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

export default function Main() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("connect", (data) => {
      console.log("hello", data);
      setResponse(data);
    });
  }, []);
  return (
    <div>
      <p> {response}</p>
    </div>
  );
}
