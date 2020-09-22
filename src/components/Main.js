import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000/";

export default function Main() {
  const [response, setResponse] = useState("");
  const socket = io.connect(ENDPOINT, { reconnection: true });

  useEffect(() => {
    socket.on("connect", (message) => {
      console.log(message);
      setResponse(message);
    });
  }, []);

  return (
    <div>
      <button>click</button>
      <p> {response}</p>
    </div>
  );
}
