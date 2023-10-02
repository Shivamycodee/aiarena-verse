import React from "react";
import "../styles/parallax.css";
import Lottie from "lottie-react";
import animationData from "../assets/tic-tac-toe.json";
import humanVsAi from '../assets/human-vs-ai.json';
import { useNavigate } from "react-router-dom";


const ParallaxTiltEffect = () => {

    const navigate = useNavigate();

    return (
      <>
        <div className="card-container">
          <div onClick={() => navigate("/tictactoe")} className="card">
            <Lottie
              style={{ width: "250px", height: "250px" }}
              animationData={animationData}
            />
            <div className="card_title title-white">
              <p>Tic Tac Toe</p>
            </div>
          </div>
          <div onClick={() => navigate("/chessboard")} className="card">
            <Lottie
              style={{ width: "250px", height: "250px" }}
              animationData={humanVsAi}
            />
            <div className="card_title title-white">
              <p>Chess</p>
            </div>
          </div>
        </div>
      </>
    );

};


export default ParallaxTiltEffect