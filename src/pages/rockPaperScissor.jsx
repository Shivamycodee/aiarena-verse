import React, { useState, useEffect } from "react";
import "../styles/rps.css";
import Button from "react-bootstrap/Button";
import RPSImg from "../assets/rps/rpsImage";
import { useGlobalContext } from "../../context/walletContext";

export default function RockPaperScissor() {
  const { getMove } = useGlobalContext();

  let arr = ["rock", "paper", "scissors"];

  const [userChoice, setUserChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null); //["rock","paper","scissors"
  const [gameState, setGameState] = useState("idle");
  const [showInter, setShowInter] = useState(true);
  const [verdict, setVerdict] = useState("draw"); //["won","lost","draw"

  const handleHandClick = async (event) => {
    setUserChoice(event.target.id);
    let val = await getMove();
    setComputerChoice(arr[val - 1]);
    setGameState("end");
  };

  const resetGame = async () => {
    setUserChoice(null);
    setShowInter(true);
    setGameState("idle");
    setVerdict("draw");
  };

  const decideWinner = () => {
    if (userChoice === computerChoice) {
      setVerdict("draw");
      return "draw";
    } else if (userChoice === "rock" && computerChoice === "scissors") {
      setVerdict("won");
      return "you won";
    } else if (userChoice === "paper" && computerChoice === "rock") {
      setVerdict("won");
      return "you won";
    } else if (userChoice === "scissors" && computerChoice === "paper") {
      setVerdict("won");
      return "you won";
    } else {
      setVerdict("lost");
      return "you lost";
    }
  };

  useEffect(() => {
    if (userChoice && gameState === "end") {
      const timer = setTimeout(() => {
        setShowInter(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [userChoice]);

  useEffect(() => {
    if (userChoice && computerChoice) {
      const timer = setTimeout(() => {
        let resultStr = decideWinner();
        alert(resultStr);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showInter]);

  return (
    <>
      <div id="rps-board">
        {gameState === "idle" ? (
          <>
            <RPSImageHolder />
            <Button
              onClick={() => setGameState("start")}
              // size="lg"
              variant="dark"
            >
              Play
            </Button>
          </>
        ) : !userChoice && verdict === "draw" ? (
          <div className="playHolder-cont">
            <img
              className="rps-img"
              id="rock"
              src={RPSImg.rock}
              alt="rock"
              onClick={handleHandClick}
            />
            <img
              className="rps-img"
              id="paper"
              src={RPSImg.paper}
              alt="paper"
              onClick={handleHandClick}
            />
            <img
              className="rps-img"
              id="scissors"
              src={RPSImg.scissors}
              alt="scissors"
              onClick={handleHandClick}
            />
          </div>
        ) : showInter ? (
          <IntermidiatePosition />
        ) : (
          <>
            <RPSResultHolder
              userChoice={userChoice}
              computerChoice={computerChoice}
            />
            <Button variant="dark" onClick={() => resetGame()}>
              Play Again
            </Button>
          </>
        )}
      </div>
    </>
  );
}

function RPSImageHolder() {
  return (
    <div id="rps-image-holder">
      <img
        style={{ width: "23%", height: "23%" }}
        src={RPSImg.rock}
        alt="rock"
      />
      <img
        style={{ width: "23%", height: "23%" }}
        src={RPSImg.paper}
        alt="paper"
      />
      <img
        style={{ width: "23%", height: "23%" }}
        src={RPSImg.scissors}
        alt="scissor"
      />
    </div>
  );
}

function IntermidiatePosition() {
  return (
    <div id="intermidiate-pos">
      <img
        className="inter-rock-img"
        style={{ transform: "scaleX(-1)", width: "23%", height: "23%" }}
        src={RPSImg.rock}
        alt="rock"
      />
      <img
        style={{ width: "23%", height: "23%" }}
        className="inter-rock-img"
        src={RPSImg.rock}
        alt="rock"
      />
    </div>
  );
}

function RPSResultHolder({ userChoice, computerChoice }) {
  const usrResponse = RPSImg[userChoice];
  const compResponse = RPSImg[computerChoice];

  return (
    <div id="rps-image-holder">
      <h4>System</h4>
      <img
        className="inter-rock-img"
        style={{ transform: "scaleX(-1)", width: "23%", height: "23%" }}
        src={compResponse}
        alt={computerChoice}
      />
      <img
        src={usrResponse}
        alt={userChoice}
        className="inter-rock-img"
        style={{ width: "23%", height: "23%" }}
      />
      <h4>User</h4>
    </div>
  );
}
