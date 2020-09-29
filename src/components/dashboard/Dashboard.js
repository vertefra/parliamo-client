import React, { useEffect, useState } from "react";
import { isaac_query_service } from "../../config";
import axios from "axios";
import TextArea from "./TextArea";

export default function Dashboard(props) {
  const [conversations, setConversations] = useState({});
  const [friend, setFriend] = useState({
    username: "",
    sid: "",
  });

  const { user, socket } = props;

  // establishConnection FUNCTION: read the username of the user selected for the conversation and grabs
  // it from the object of connectedUser set it as "friend". selecting a "friend" express the will
  // of the user to start a conversation with him. If a conversation is already active in the
  // conversations object it will update it otherwise it will create a new one. Every time that the
  // user selects a new "friend", the props with friend details and the relative conversation
  // is sent to TextArea component to be rendered

  const establishConnection = async (e) => {
    console.log("establishing connection with: ", e.target.id);

    // query all the history for the selected user
    if (user.username) {
      const amigo = props.connectedUsers[e.target.id];
      setFriend(amigo);
      try {
        const res = await axios.get(
          `${isaac_query_service}/query?user=${user.username}&friend=${e.target.id}`
        );
        console.log(res.data);
        console.log(amigo.username);
        console.log("create", amigo.username);
        setConversations({
          ...conversations,
          [amigo.username]: [...res.data.messages],
        });
        // }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("LOGIN OR SIGN UP PLEASE");
    }
  };

  const sendMessage = (message) => {
    console.log("send message");

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
        if (conversations[friend.username]) {
          console.log("update");
          const newData = [msg, ...conversations[friend.username]];
          setConversations({
            ...conversations,
            [friend.username]: newData,
          });
        } else {
          console.log("create", friend.username);
          setConversations({
            ...conversations,
            [friend.username]: [msg],
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
      console.log(conversations);
      // from here I received a message. If it's an open coversation ok, but
      // if it's not I need to open a conversation in conversations object

      if (conversations[data.sender_username]) {
        console.log("update");
        const newData = [...conversations[data.sender_username], data];
        setConversations({
          ...conversations,
          [data.sender_username]: newData,
        });
      } else {
        console.log("create");
        setConversations({
          ...conversations,
          [data.sender_username]: [data],
        });
      }
    });

    // clean up for socket

    return () => socket.off("dispatched_message");
  }, [conversations]);

  return (
    <>
      <ul className="onlineUsers">
        <h1>Wellcome {user.username}!</h1>
        <h1>online now:</h1>
        {Object.keys(props.connectedUsers).map((username) => {
          if (username !== user.username && username)
            return (
              <li key={username}>
                <div
                  className="userButton"
                  id={username}
                  onClick={establishConnection}
                >
                  {props.connectedUsers[username].username}
                </div>
              </li>
            );
        })}
      </ul>
      <TextArea
        user={user}
        friend={friend}
        sendMessage={sendMessage}
        conversation={conversations[friend.username]}
      />
    </>
  );
}
