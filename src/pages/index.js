import Head from "next/head";

import style from "@/styles/Home.module.css";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  InfoButton,
  TypingIndicator,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([
    {
      message: "Wellcome to AI Assistant chat bot support ",
      sentTime: "now",
      sender: "AI Assistant bot",
      direction: "incoming",
      position: "single",
    },
  ]);
  const onSendMessage = async (message) => {
    console.log("message", message);
    setMessage((prv) =>
      prv.concat({
        message: message,
        sentTime: "now",

        sender: "User",

        direction: "outgoing",

        position: "last",
      })
    );
    try {
      setLoading(true);
      let data = await axios.post(
        "https://ad35-39-55-227-153.ngrok-free.app/utahchat",
        {
          message: message,
        },
        {
          auth: {
            username: "user",
            password: "soft",
          },
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      console.log("data", data);
      if (data.data.response == "Chat deleted from server!") {
        setMessage([]);
      }
      setMessage((prv) =>
        prv.concat({
          message: data.data.response,
          sentTime: "now",
          sender: "User",
          direction: "incoming",
          position: "last",
          sender: "Akane",
        })
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>AI Assistant ChatBot</title>
        <meta name="description" content="AI Assistant Chat-Bot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/chatBotLogo.png" />
      </Head>
      <main
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="mainContainer">
          <ChatContainer>
            <ConversationHeader>
              <Avatar src={"./chatBotLogo.png"} name="AI-Assistant Bot" />
              <ConversationHeader.Content
                userName="AI Assistant"
                info="online"
              />
            </ConversationHeader>
            <MessageList
              style={{ height: "83%" }}
              typingIndicator={
                loading ? (
                  <TypingIndicator content={"AI Assistant is typing"} />
                ) : (
                  <></>
                )
              }
            >
              {/* <MessageSeparator content="Saturday, 30 November 2019" /> */}
              {message.map((data, index) => (
                <Message model={data} key={index}>
                  <Avatar src={`./chatBotLogo.png`} name="Akane" />
                </Message>
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              attachButton={false}
              onSend={onSendMessage}
            />
          </ChatContainer>
        </div>
      </main>
    </>
  );
}
