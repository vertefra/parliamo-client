import React, { useState, useEffect } from "react";
import { compareFunction, dateOptionsMsg } from "../../config";

export default function TextArea(props) {
  const [message, setMessage] = useState("");

  const { friend, user, conversation, sendMessage } = props;

  const handleChange = (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  useEffect(() => {
    if (conversation && conversation.length > 0) {
      conversation.sort(compareFunction);
    }
  }, [conversation]);

  return (
    <div className="textArea">
      {/* // Text area and translation area */}
      <div className="messagesControll">
        <form>
          <div className="hiddenLabel">
            {friend.username && (
              <div className="card">{`chat with ${friend.username}`}</div>
            )}
          </div>

          <div className="sendMessage">
            <textarea
              id="textArea"
              value={message}
              className="primary-inp"
              onChange={handleChange}
            ></textarea>
            <input
              type="button"
              value=">"
              onClick={(e) => {
                sendMessage(message);
                setMessage("");
              }}
              className="primary-btn"
            />
          </div>
        </form>
      </div>

      {/* conversation area  */}

      <div className="conversation">
        {friend.username && conversation && conversation.length >= 0
          ? conversation.map((msg) => {
              const msgClass =
                msg.sender_username === user.username
                  ? "sentMessage"
                  : "receivedMessage";
              const msgTimestamp = new Date(msg.timestamp).toLocaleString(
                "en-US",
                dateOptionsMsg
              );
              return (
                <div className={`message ${msgClass}`} key={msg.timestamp}>
                  <header>
                    <h3>
                      {msgClass === "sentMessage"
                        ? "you: "
                        : `${msg.sender_username}`}
                    </h3>
                  </header>
                  <p>{msg.message}</p>
                  <footer>{msgTimestamp}</footer>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
