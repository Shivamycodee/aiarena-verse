import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

import React, { useState } from "react";
import Parallax from "../components/parallax";
import HumanWithAI from "./humanWithAi";
import TicTacToe from "./tictactoe";
import Chess from "./chessboard";
import AiVsAi from "./aivsai";
import ChessAI2 from './chessai2'
import NoPage from "./nopage";
import HumanWithHuman from "./humanWithHuman";
import RockPaperScissor from "./rockPaperScissor";
import ChatBotAni from "../assets/chatbotani.json";
import Lottie from "lottie-react";
import "../index.css";

import {getAnswer} from '../api/move.js'

function Home() {
  return (
    <div id="full-body">
      <Parallax />
    </div>
  );
}

function App() {

  const [flag, setFlag] = useState(true);
  const [msg, setMsg] = useState([{
    txt: "hi user...",
    dir: "incoming",
  }]);


const sendMessage = async (e) => {
  // First update

  // e = e.toLowerCase();
  setMsg((prevMsg) => [...prevMsg, { txt: e, dir: "outgoing" }]);

  let ans = await getAnswer(e);
  let res = (ans.message).split("\n\n")[1];
 console.log(res);
  // Second update
  setMsg((prevMsg) => [...prevMsg, { txt: res, dir: "incoming" }]);
};

const closeChatbot = () => {
  setFlag(true);
  console.log("flag changed");
}

  
  const handleChat = () => {
    setFlag(false);
    console.log("flag changed");
  };

  return (
    <>
      <div id="full-body">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="humanWithAi/tictactoe" element={<TicTacToe />} />
            <Route path="humanWithAi/chessboard" element={<Chess />} />
            <Route path="aivsai/chessai2" element={<ChessAI2 />} />
            <Route path="humanWithAi" element={<HumanWithAI />} />
            <Route
              path="humanWithHuman/rockPaperScissor"
              element={<RockPaperScissor />}
            />
            <Route path="humanWithHuman" element={<HumanWithHuman />} />
            <Route path="aivsai" element={<AiVsAi />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </div>

      {flag ? (
        <Lottie
          className="chatbot-lottie"
          onClick={() => handleChat()}
          animationData={ChatBotAni}
        />
      ) : (
        <div className="chatbot-ui">
          <h6 className="chatbot-closer" onClick={() => closeChatbot()}>
            X
          </h6>
          <MainContainer>
            <ChatContainer>
              <ConversationHeader>
                <ConversationHeader.Content userName="Bot" />
              </ConversationHeader>

              <MessageList>
                &nbsp;
                {msg
                  ? msg.map((m) => {
                      return (
                        <Message
                          style={{ textTransform: "none" }}
                          model={{
                            message: m.txt,
                            direction: m.dir,
                            position: "single",
                          }}
                        />
                      );
                    })
                  : null}
              </MessageList>
              <MessageInput
                sendButton={false}
                style={{ textTransform: "none" }}
                attachButton="false"
                placeholder="Type message here"
                onSend={(e) => sendMessage(e)}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
    </>
  );
}

export default App;
