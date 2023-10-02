import React, { useState,useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../styles/tictactoe.css";
import Notification from "./notification";
import { newGame,makeMove } from "../api/move";
import { v4 as uuidv4 } from "uuid";

export default function TicTacToe() {

  const [board, setBoard] = useState(Array(9).fill(null));
  const [result, setResult] = useState(null);
  const [gameToken,setGameToken] = useState(null);
  const [winningPattern, setWinningPattern] = useState([]);


const renderSquare = (index) => (
  <Col
    xs={4}
    className={`square ${
      index === 2 || index === 5 || index === 8 ? "" : "border-right"
    } 
      ${index === 6 || index === 7 || index === 8 ? "" : "border-bottom"}
      ${winningPattern && winningPattern.includes(index) ? "winning-pattern" : ""}`}
    onClick={() => handleClick(index)}
  >
    <div className="content">{board[index]}</div>
  </Col>
);

 const updateBoard = (index, value, newBoard) => {
   newBoard[index] = value;
   setBoard([...newBoard]);
 };

 const handleClick = async (index) => {
   let newBoard = [...board];
   updateBoard(index, "O", newBoard);
   const data = await makeMove(index, gameToken);

   if (data && data.ai_move !== undefined) {
     updateBoard(data.ai_move, "X", newBoard);
   }

   if (data && data.winner !== undefined) {
      const pattern = findWinningPattern(newBoard);
      setWinningPattern(pattern);

       setTimeout(() => {
        setResult(data.winner);
      }, 1000);
    //  setResult(data.winner);
     return;
   }

 };

 useEffect(()=>{
    const token = uuidv4();
    newGame(token);
    setGameToken(token);
    setWinningPattern([]);
 },[])

 const findWinningPattern = (board) => {
   for (let combination of winningCombinations) {
     const [a, b, c] = combination;
     if (board[a] && board[a] === board[b] && board[a] === board[c]) {
       return combination;
     }
   }
   return null;
 };


 const winningCombinations = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6],
 ];


  return (
    <>
      {result === null ? (
        <Container style={{ margin: "8% 0 0 22%", width: "50%" }}>
          <Row className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </Row>
          <Row className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </Row>
          <Row className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </Row>
        </Container>
      ) : (
        <Notification
          result={result}
          setResult={setResult}
          setBoard={setBoard}
          setGameToken={setGameToken}
          setWinningPattern={setWinningPattern}
        />
      )}
    </>
  );
}

