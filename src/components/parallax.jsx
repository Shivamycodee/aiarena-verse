import React from "react";
import "../styles/parallax.css";
import Lottie from "lottie-react";
import humanVsRobot from '../assets/human-robot2.json';
import aiLaptop from '../assets/ai-laptop.json';
import HumanWithHuman from "../assets/humanwithhuman.json";
import { useNavigate } from "react-router-dom";


const ParallaxTiltEffect = () => {

    const navigate = useNavigate();

    return (
      <>
        <div className="card-container">

          <div onClick={() => navigate("/humanWithHuman")} className="card">
            <Lottie
              style={{ width: "250px", height: "250px" }}
              animationData={HumanWithHuman}
            />
            <div className="card_title title-white">
              <p>Human v/s Human</p>
            </div>
          </div>

          <div onClick={() => navigate("/humanWithAi")} className="card">
            <Lottie
              style={{ width: "250px", height: "250px" }}
              animationData={humanVsRobot}
            />
            <div className="card_title title-white">
              <p>Human v/s AI</p>
            </div>
          </div>
          <div onClick={() => navigate("/aivsai")} className="card">
            <Lottie
              style={{ width: "250px", height: "250px" }}
              animationData={aiLaptop}
            />
            <div className="card_title title-white">
              <p>AI v/s AI</p>
            </div>
          </div>
        </div>
      </>
    );

};


export default ParallaxTiltEffect