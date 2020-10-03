import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import userAvatar from "@iconify/icons-carbon/user-online";
import bxMessageRounded from "@iconify/icons-bx/bx-message-rounded";
import { compareFunction, isaac_query_service } from "../../config";
import axios from "axios";
import TextArea from "./TextArea";

export default function Dashboard(props) {
  const [conversations, setConversations] = useState({});
  const [error, setError] = props.errorControllers;
  const [incomingMessage, setIncomingMessages] = useState({});
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
    // query all the history for the selected user
    if (user.username) {
      const amigo = props.connectedUsers[e.target.id];
      console.log("establishing connection with: ", amigo);
      setIncomingMessages({
        ...incomingMessage,
        [e.target.id]: false,
      });
      setFriend(amigo);
      try {
        const res = await axios.get(
          `${isaac_query_service}/query?user=${user.username}&friend=${e.target.id}`
        );
        res.data.messages.sort(compareFunction);
        setConversations({
          ...conversations,
          [amigo.username]: [...res.data.messages],
        });
        // }
      } catch (err) {
        console.log(err);
        setError("something went wrong. Please try again");
      }
    } else {
      setError("Login or Sign up!");
    }
  };

  const sendMessage = (message) => {
    if (friend.username && friend.sid) {
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
        } else {
          console.log("error");
        }
      });
    } else {
      console.log("errror");
      setError("Select a recipient first!");
    }
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

        const newData = [data, ...conversations[data.sender_username]];
        setConversations({
          ...conversations,
          [data.sender_username]: newData,
        });

        setIncomingMessages({
          ...incomingMessage,
          [data.sender_username]: true,
        });

        // this will set the key with the sender username in incoming messages
        // to true, triggering the rendering of thje new message icon

        //=====================================================================
      } else {
        console.log("create");
        console.log(
          "message receive set incoming message to true for ",
          data.sender_username
        );
        setIncomingMessages({
          ...incomingMessage,
          [data.sender_username]: true,
        });
        setConversations({
          ...conversations,
          [data.sender_username]: [data],
        });
      }
    });

    // clean up for socket

    return () => socket.off("dispatched_message");
  }, [conversations, socket, incomingMessage]);

  return (
    <>
      <ul className="onlineUsers">
        <h1>connected as: {user.username}</h1>
        <h2>online now:</h2>
        {Object.keys(props.connectedUsers).map((username) => {
          if (username !== user.username && username)
            return (
              <li key={username}>
                <div
                  className="userButton card"
                  id={username}
                  onClick={establishConnection}
                >
                  <div className="avatarIcon">
                    <Icon icon={userAvatar} color="black" />
                  </div>

                  <p>{props.connectedUsers[username].username}</p>
                  {incomingMessage[username] && (
                    <div className="incomingMessage">
                      <Icon icon={bxMessageRounded} />
                    </div>
                  )}
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
