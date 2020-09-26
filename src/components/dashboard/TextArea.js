import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export default function TextArea(props) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const { friend, socket } = props;

  const sendMessage = (e) => {
    e.preventDefault();
    if (friend.sid) {
      socket.emit("message_to", {
        friend_sid: friend.sid,
        message: message,
        timeStamp: Date.now(),
      });
      setMessage("");
    } else {
      console.log("Friend sid invalid ", friend.sid);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("message_from", (data) => {
        // updating the conversation with an object that is the timestamp of the message

        const convObj = {
          [data.timestamp]: data,
        };
        setConversation((conv) => [...conv, convObj]);
      });

      // updating the conversation with an object that is the timestamp of the message

      socket.on("message_sent", (data) => {
        const convObj = {
          [data.timestamp]: data,
        };
        setConversation((conv) => [...conv, convObj]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (friend) {
      console.log("load history of conversation from service");
    }
  }, [friend]);
  useEffect(() => {
    console.log(conversation);
  });

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
      <div className="conversation"></div>

      {/*
       
        conversation is an array of object and each object has as key the timestamp 
        retrieving the key in order to access the rest of the object in the value "key"
        and then conditionally rendering the message based on if the massage 
        has been sent or received

      */}

      {conversation.length > 0 &&
        conversation.map((msg) => {
          {
            const key = Object.keys(msg)[0];
            const msgType = msg[key].message_sent ? "msgSent" : "msgReceived";

            return (
              <div className={msgType} key={msg[key].timestamp}>
                <h2>
                  {msgType === "msgSent"
                    ? "Sent: "
                    : `From: ${msg[key].sender_username}`}
                </h2>
                <p>
                  {msgType === "msgSent"
                    ? `${msg[key].message_sent}`
                    : `${msg[key].message_received}`}
                </p>
              </div>
            );
          }
        })}
    </div>
  );
}
