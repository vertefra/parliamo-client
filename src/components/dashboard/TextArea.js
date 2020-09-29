import React, { useState, useEffect } from "react";
import { compareFunction, dateOptionsMsg } from "../../config";

export default function TextArea(props) {
  const [message, setMessage] = useState("");

  const { friend, user, conversation, sendMessage } = props;

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
          <input
            type="button"
            value="send"
            onClick={(e) => {
              sendMessage(message);
              setMessage("");
            }}
          />
        </div>
      </form>
      <div className="conversation"></div>
      {conversation && conversation.length >= 0
        ? conversation.sort(compareFunction).map((msg) => {
            {
              const msgClass =
                msg.sender_sid === user.sid ? "sentMessage" : "receivedMessage";
              const msgTimestamp = new Date(msg.timestamp).toLocaleString(
                "en-US",
                dateOptionsMsg
              );
              console.log(msgTimestamp);
              return (
                <div className={msgClass} key={msg.timestamp}>
                  <header>
                    {msgClass === "sentMessage"
                      ? "you: "
                      : `${msg.sender_username}`}
                    {msgTimestamp}
                  </header>
                  <p>{msg.message}</p>
                </div>
              );
            }
          })
        : "...Loading"}
    </div>
  );
}
