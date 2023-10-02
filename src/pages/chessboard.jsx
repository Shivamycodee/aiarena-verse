import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { makeChessMove, GameEnd } from "../api/move";
import Button from "react-bootstrap/Button";
import Piece from "../assets/transferPiece";

export default function ChessBoard() {

  const [game, setGame] = useState(new Chess());
  const [deadPiece,setDeadPiece] = useState([]); // [ {color: "w", type: "p"}, {color: "b", type: "p"}

  function makeAMove(move) {
    const result = game.move(move);
    setGame(new Chess(game.fen()));
    return result; 
  }


  function HandleMoveAI(move) {
    move = move.move;
    let sourceSquare = move.substring(0, 2);
    let targetSquare = move.substring(2, 4);

    const legalMoves = game.moves({ verbose: true });
    const isMoveLegal = legalMoves.some(
      (move) => move.from === sourceSquare && move.to === targetSquare
    );
    if (isMoveLegal) {
      makeAMove({ from: sourceSquare, to: targetSquare });
      getCapturedPieces();
      console.info(deadPiece)
    } else {
      console.log("Move is not legal!",move);
    }
  }



  async function checkIfGameOver() {

    if (game.isCheckmate()) {
      alert(game.turn() === "w" ? "Black wins!" : "White wins!");
      ResetChess();
      return true; // End the function if the game is over
    }

  }

  const DeadPieceStr = (piece)=>{
    let pieceStr = `${piece.color}${piece.type}`;
    return pieceStr;
  }

  const getCapturedPieces = () => {
    const history = game.history({ verbose: true });
    const capturedPieces = [];
    let capturedPiecesStr = [];

    history.forEach((move) => {
      if (move.captured) {
        capturedPieces.push({
          color: move.color === "w" ? "b" : "w", // opposite of the mover's color
          type: move.captured,
        });
      }
    });

    for(let i =0;i<capturedPieces.length;i++)
      capturedPiecesStr.push(DeadPieceStr(capturedPieces[i]));

    if(deadPiece.length === 0)
     setDeadPiece(capturedPiecesStr);
  else
    setDeadPiece([...deadPiece, ...capturedPiecesStr]);      
  };

  async function onDrop(sourceSquare, targetSquare) {
    if (sourceSquare === targetSquare) {
      console.log("u fucked up");
      return false;
    } // Skip if the piece was dropped on its starting square

    let moveObj = {
      from: sourceSquare,
      to: targetSquare,
    };

    // If a pawn is being promoted, add the promotion field.
    if (
      (game.turn() === "w" && targetSquare[1] === "8") ||
      (game.turn() === "b" && targetSquare[1] === "1")
    ) {
      moveObj.promotion = "q"; // Promote to queen
    }

    const move = makeAMove(moveObj);
    const MoveAI = await makeChessMove(`${sourceSquare}${targetSquare}`);
    checkIfGameOver(); // check for win...

    HandleMoveAI(MoveAI);

    checkIfGameOver(); // check for win...

    if (move === null) return false;
    return true;
  }

useEffect(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, []);

const handleBeforeUnload = async (e) => {
  e.preventDefault();
  e.returnValue =
    "All your data will be lost. Do you still want to close the window?";     
        
    const msg = await GameEnd();
    console.log(msg.message);

};

const ResetChess =  async() => {
  setGame(new Chess());
  const msg = await GameEnd();
  console.log(msg.message);
  setDeadPiece([])
}

  return (
    <div id="chess-container">
      <div id="basicBoard-cont">
        <Chessboard position={game.fen()} onPieceDrop={onDrop} />
      </div>
      <div id="chess-piecesHolder">
        <Button size="lg" variant="dark">
          {deadPiece.length !== 0 ? (
            deadPiece.map(
              (piece, index) =>
                piece.includes("w") && (
                  <img
                    key={index}
                    alt=""
                    src={Piece[piece]}
                    width="30"
                    height="30"
                  />
                )
            )
          ) : (
            <code style={{ color: "white" }}>Dead White Pieces</code>
          )}
        </Button>

        <Button variant="outline-secondary" size="lg" onClick={ResetChess}>
          Restart
        </Button>

        <Button size="lg" style={{ margin: "0" }} variant="light">
          {deadPiece.length !== 0 ? (
            deadPiece.map(
              (piece, index) =>
                piece[0] === "b" && (
                  <img
                    key={index}
                    alt=""
                    src={Piece[piece]}
                    width="30"
                    height="30"
                  />
                )
            )
          ) : (
            <code style={{ color: "black" }}>Dead Black Pieces</code>
          )}
        </Button>
      </div>
    </div>
  );
}
