import React, { useEffect, useState } from "react";
import TextArea from "./TextArea";

export default function Dashboard(props) {
  const [conversations, setConversations] = useState({});
  const [friend, setFriend] = useState({
    username: "",
    sid: "",
  });

  const { user, socket } = props;

  // establishConnection FUNCTION: read the id of the user selected for the conversation at grabs
  // it from the object of active user setting it as "friend". selecting a "friend" express the will
  // of the user to start a conversation with him. If a conversation is already active in the
  // conversations object it will update it otherwise it will create a new one. Every time that the
  // user selects a new "friend", the props with friend details and the relative conversation
  // is sent to TextArea component to be rendered

  const establishConnection = (e) => {
    const amigo = props.connectedUsers[e.target.id];
    setFriend(amigo);
  };

  const sendMessage = (message) => {
    const msg = {
      recipient_sid: friend.sid,
      recipient_username: friend.username,
      sender_sid: user.sid,
      sender_username: user.username,
      timestamp: Date.now(),
      message,
    };
    socket.emit("message_to", msg);
    socket.on("ok_status", (data) => {
      if (data) {
        if (conversations[friend.sid]) {
          console.log("update");
          const newData = [...conversations[friend.sid], msg];
          setConversations({
            ...conversations,
            [friend.sid]: newData,
          });
        } else {
          console.log("create", friend.sid);
          setConversations({
            ...conversations,
            [friend.sid]: [msg],
          });
        }
        socket.off("ok_status");
        socket.off("message_to");
      }
    });
  };

  // SOCKET MESSAGE DISPATCHER: is linked to a useEffect triggered by conversations
  // it creates a new object in the conversations with the id of the session id
  // of the sender. In case the id already exist it will update the conversation
  // also if the user is chatting with another user making possible to follow multiple
  // conversation at the same time. the message sent is updated in the same conversation
  // when the message is sent

  useEffect(() => {
    socket.on("dispatched_message", (data) => {
      console.log(data);

      // from here I received a message. If it's an open coversation ok, but
      // if it's not I need to open a conversation in conversations object

      if (conversations[data.sender_sid]) {
        console.log("update");
        const newData = [...conversations[data.sender_sid], data];
        setConversations({
          ...conversations,
          [data.sender_sid]: newData,
        });
      } else {
        console.log("create");
        setConversations({
          ...conversations,
          [data.sender_sid]: [data],
        });
      }
    });

    // clean up for socket

    return () => socket.off("dispatched_message");
  }, [conversations]);

  return (
    <div id="dashboard">
      <ul className="onlineUsers">
        <h1>Hello {user.username}!</h1>
        <h1>online now:</h1>
        {Object.keys(props.connectedUsers).map((sid) => {
          if (sid !== user.sid)
            return (
              <li key={sid}>
                <div
                  className="userButton"
                  id={sid}
                  name={props.connectedUsers[sid].username}
                  onClick={establishConnection}
                >
                  {props.connectedUsers[sid].username}
                </div>
              </li>
            );
        })}
      </ul>
      <TextArea
        user={user}
        friend={friend}
        sendMessage={sendMessage}
        conversation={conversations[friend.sid]}
      />
    </div>
  );
}
