import Head from "next/head";
import { useRef } from "react";

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
  Button,
} from "@chatscope/chat-ui-kit-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [isFirstRender, setFirstRender] = useState(true);
  const firstRender = useRef(true);
  console.log(firstRender);

  const [value, setValue] = useState("");

  const [message, setMessage] = useState([]);

  const resetChat = () => {
    // firstRender.current = true;
    // setFirstRender(true);
    onSendMessage("Reset");
  };

  const getWelcomeMsg = async (msg) => {
    console.log("im called 1");
    try {
      setLoading(true);
      let data = await axios.post(
        "http://15.222.236.105/utahchat",
        {
          message: msg,
          user_id: "1",
          new_chat: "1",
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

      const searchText = "Chat deleted from server!";
      if (data.data.response.includes(searchText)) {
        let response = data.data.response.replace(searchText, "");
        console.log({ response });
        setMessage((prv) =>
          prv.concat({
            message: response,
            sentTime: "now",
            sender: "User",
            direction: "incoming",
            position: "last",
            sender: "Akane",
          })
        );
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      setFirstRender(false);
    }
  };

  useEffect(() => {
    if (firstRender.current === true) {
      getWelcomeMsg("good day");
      firstRender.current = false;
      console.log("areeb", firstRender.current);
    }
  }, [firstRender.current]);

  const onSendMessage = async (message) => {
    console.log("im called 2");

    console.log("message", message);
    setValue("");
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
        "https://datancare.com/api/utahchat",
        {
          message: message,
          user_id: "1",
          new_chat: "0",
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
      const searchText = "Chat deleted from server!";
      if (data.data.response.includes(searchText)) {
        let response = data.data.response.replace(searchText, "");
        console.log({ response });
        setMessage([
          {
            message: response,
            sentTime: "now",
            sender: "User",
            direction: "incoming",
            position: "last",
            sender: "Akane",
          },
        ]);
      } else {
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
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      setFirstRender(false);
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
              <ConversationHeader.Actions>
                {/* <Button border>Reset Chat</Button> */}
                <Button onClick={resetChat}>Reset Chat</Button>
              </ConversationHeader.Actions>
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
            <input />
            <MessageInput
              placeholder="Type message here"
              attachButton={false}
              onSend={onSendMessage}
              onChange={(val) => setValue(val)}
              value={value}
              onPaste={(evt) => {
                evt.preventDefault();
                setValue(evt.clipboardData.getData("text"));
              }}
            />
          </ChatContainer>
        </div>
      </main>
    </>
  );
}
