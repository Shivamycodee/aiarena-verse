import React from "react";
import Lottie from "lottie-react";
import RPC from "../assets/rock-paper-scissors.json";
import { useNavigate } from "react-router-dom";

function HumanWithHuman() {

    const navigate = useNavigate();

  return (
    <>
      <div className="card-container">
        <div onClick={() => navigate("rockPaperScissor")} className="card">
          <Lottie
            style={{ width: "250px", height: "250px" }}
            animationData={RPC}
          />
          <div className="card_title title-white">
            <p>Rock Paper Sci...</p>
          </div>

          
        </div>
      </div>
    </>
  );
}

export default HumanWithHuman;
