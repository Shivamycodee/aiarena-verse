import React from 'react'
import Lottie from "lottie-react";
import CommingSoon from '../assets/comming-soon.json'
import { useNavigate } from "react-router-dom";
import ChessAIAI from "../assets/chessAiAi.json";


function AiVsAi() {

      const navigate = useNavigate();

      
  return (
    <>
      <div className="card-container">
        <div onClick={() => navigate("chessai2")} className="card">
          <Lottie
            style={{ width: "250px", height: "250px" }}
            animationData={ChessAIAI}
          />
          <div className="card_title title-white">
            <p>Chess</p>
          </div>
        </div>
        </div>
      {/* <Lottie
        style={{ 
        width: "min(100%, 800px)",
        margin:"auto" 
      }}
      animationData={CommingSoon}
      /> */}
    </>
  );
}

export default AiVsAi