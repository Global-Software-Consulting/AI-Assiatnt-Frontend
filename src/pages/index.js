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

export default function Home({ statusMessage, userId }) {
  const [loading, setLoading] = useState(false);
  const [isFirstRender, setFirstRender] = useState(true);
  const [isDisable, setDisable] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState("");
  const firstRender = useRef(true);
  console.log(firstRender);

  const [value, setValue] = useState("");

  const [message, setMessage] = useState([]);

  const resetChat = () => {
    // firstRender.current = true;
    // setFirstRender(true);
    onSendMessage("Reset");
  };

  useEffect(() => {
    if (statusMessage == "") {
      return;
    }
    setMessage([
      {
        message: statusMessage,
        sentTime: "now",
        sender: "User",
        direction: "incoming",
        position: "last",
        sender: "Akane",
      },
    ]);
  }, []);

  const onSendMessage = async (message) => {
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
          user_id: userId,
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

  const onSelectOption = async (message) => {
    setSelectedBtn(message);
    setButtonLoading(true);
    setDisable(false);
    console.log("message", message);
    // setMessage((prv) =>
    //   prv.concat({
    //     message: message,
    //     sentTime: "now",

    //     sender: "User",

    //     direction: "outgoing",

    //     position: "last",
    //   })
    // );
    try {
      let data = await axios.post(
        "https://datancare.com/api/utahchat",
        {
          message: message,
          user_id: userId,
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
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
      setFirstRender(false);
      setButtonLoading(false);
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
              {message.map((data, index) => {
                console.log({ index });
                if (index == 0) {
                  return (
                    <>
                      <Message model={data} key={index}>
                        <Avatar src={`./chatBotLogo.png`} name="Akane" />
                      </Message>
                      <div
                        style={{
                          width: "100%",
                          textAlign: "center",
                          paddingBottom: "20px",
                        }}
                      >
                        <h3>What do you want to search?</h3>
                        <Button
                          border
                          style={{
                            backgroundColor:
                              selectedBtn == "dr-information" ? "blue" : "",
                            padding: "10px 20px",
                          }}
                          onClick={() => onSelectOption("dr-information")}
                        >
                          Dr Information
                        </Button>
                        <Button
                          style={{
                            backgroundColor:
                              selectedBtn == "general-query" ? "blue" : "",
                            padding: "10px 20px",
                          }}
                          border
                          onClick={() => onSelectOption("general-query")}
                        >
                          General Query{" "}
                        </Button>
                      </div>
                    </>
                  );
                } else {
                  return (
                    <Message model={data} key={index}>
                      <Avatar src={`./chatBotLogo.png`} name="Akane" />
                    </Message>
                  );
                }
              })}
            </MessageList>
            <input />
            <MessageInput
              placeholder="Type message here"
              attachButton={false}
              disabled={isDisable}
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

export async function getServerSideProps() {
  // Fetch data from external API
  try {
    const timestamp = Date.now().toString(36); // Convert current time to base36 string
    const randomString = Math.random().toString(36).substr(2, 5); // Generate random string
    const uniqueId = timestamp + randomString; // Concatenate the timestamp and random string

    let data = await getWelcomeMsg("good day", uniqueId);
    console.log("datadatadata", data);
    return { props: { statusMessage: data, userId: uniqueId } };
  } catch (error) {
    return { props: { statusMessage: "", userId: uniqueId } };
  }
  // Pass data to the page via props
}

const getWelcomeMsg = async (msg, userId) => {
  console.log("im called 1");
  try {
    let data = await axios.post(
      "https://datancare.com/api/utahchat",
      {
        message: msg,
        user_id: userId,
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
    const searchText = "Chat deleted from server!";
    if (data.data.response.includes(searchText)) {
      let response = data.data.response.replace(searchText, "");
      return response;
    }
    return data.data.response;
  } catch (error) {
    console.log("error", error);
    return "";
  }
};
