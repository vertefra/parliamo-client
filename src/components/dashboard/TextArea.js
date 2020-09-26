import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export default function TextArea(props) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const { friend, socket } = props;

  const sendMessage = () => {
    console.log("send message");
    socket.emit("message_to", { friend_sid: friend.sid, message: message });
    setMessage("");
  };

  useEffect(() => {
    if (socket) {
      socket.on("message_from", (data) => {
        console.log(data);
      });
      socket.on("message_sent", (data) => {
        console.log(data);
      });
    }
  }, [socket]);

  return (
    <div className="textArea">
      <form>
        <label htmlFor="textArea">
          {friend.username && `chat with ${friend.username}`}
        </label>
        <div>
          <textarea
            id="textArea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <input type="button" value="send" onClick={sendMessage} />
        </div>
      </form>
    </div>
  );
}
