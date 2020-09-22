import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000/";

export default function Main() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = io.connect(ENDPOINT, { reconnection: true });
    socket.on("responseMessage", (message) => {
      console.log("hello", message);
      setResponse(message);
    });
  }, []);
  return (
    <div>
      <p> {response.data}</p>
    </div>
  );
}
