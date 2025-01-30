import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/tic-tac-toe.json";
import humanVsAiAsset from "../assets/humanandai.json";
import { useNavigate } from "react-router-dom";


function HumanVsAi() {

    const navigate = useNavigate();


  return (
    <>

<div class="marquee">
            Quick heads-up, gamers! 🎮 Our AWS lightsail needs a short nap (and
            my wallet a refill 💸). Game's on a tiny break until payday swoops
            in! 🦸‍♂️ Sorry for the pause, we'll be back soon! 🚀
          </div>


      <div className="card-container">
        <div onClick={() => navigate("tictactoe")} className="card">
          <Lottie
            style={{ width: "250px", height: "250px" }}
            animationData={animationData}
          />
          <div className="card_title title-white">
            <p>Tic Tac Toe</p>
          </div>
        </div>
        <div onClick={() => navigate("chessboard")} className="card">
          <Lottie
            style={{ width: "250px", height: "250px" }}
            animationData={humanVsAiAsset}
          />
          <div className="card_title title-white">
            <p>Chess</p>
          </div>
        </div>
      </div>
    </>
  );

}

export default HumanVsAi;
