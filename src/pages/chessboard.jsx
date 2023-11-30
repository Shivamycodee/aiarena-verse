import { useState, useEffect,useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { makeChessMove, boardReset } from "../api/move";
import Button from "react-bootstrap/Button";
import Piece from "../assets/transferPiece";
import { v4 as uuidv4 } from "uuid";

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());
  const [deadPiece, setDeadPiece] = useState([]); // [ {color: "w", type: "p"}, {color: "b", type: "p"}
  const [chessToken, setChessToken] = useState(null);


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
    } else {
      console.log("Move is not legal!", move);
    }
  }

  async function checkIfGameOver() {
    if (game.isCheckmate()) {
      alert(game.turn() === "w" ? "Black wins!" : "White wins!");
      setChessToken(null);
      ResetChess();
      return true; // End the function if the game is over
    } else if (game.isStalemate()) {
      alert("Stalemate!");
      setChessToken(null);
      ResetChess();
      return true;
    } else if (game.isDraw()) {
      alert("Draw!");
      setChessToken(null);
      ResetChess();
      return true;
    }
  }

  const DeadPieceStr = (piece) => {
    let pieceStr = `${piece.color}${piece.type}`;
    return pieceStr;
  };

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

    for (let i = 0; i < capturedPieces.length; i++)
      capturedPiecesStr.push(DeadPieceStr(capturedPieces[i]));

    if (deadPiece.length === 0) setDeadPiece(capturedPiecesStr);
    else setDeadPiece([...deadPiece, ...capturedPiecesStr]);
  };

  async function onDrop(sourceSquare, targetSquare, piece) {

    let movedPiece = (game.get(sourceSquare)).type;
   let retrunPiece = piece[1].toLowerCase();

    let moveObj = {
      from: sourceSquare,
      to: targetSquare,
    };

    // If a pawn is being promoted, add the promotion field.
    if (
      ((game.turn() === "w" && targetSquare[1] === "8") ||
      (game.turn() === "b" && targetSquare[1] === "1")) &&
      movedPiece === "p"
    ) {
      moveObj.promotion = retrunPiece;
    }

    let move = makeAMove(moveObj);
    
    const inputMoveStr = moveObj.promotion
    ? `${moveObj.from}${moveObj.to}${moveObj.promotion}`
    : `${moveObj.from}${moveObj.to}`;
    
    

    const MoveAI = await makeChessMove(inputMoveStr, chessToken);

    checkIfGameOver(); 
    HandleMoveAI(MoveAI);
    checkIfGameOver(); 

    if (move === null) return false;
    return true;
  }

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const token = uuidv4();
    boardReset(chessToken, token);
    setChessToken(token);
  }, []);


  const handleBeforeUnload = async (e) => {
    e.preventDefault();
    e.returnValue =
      "All your data will be lost. Do you still want to close the window?";
  };

  const ResetChess = async () => {
    setGame(new Chess());
    const token = uuidv4();
    const msg = await boardReset(chessToken, token);
    setChessToken(token);
    console.log(msg.message);
    setDeadPiece([]);
  };

  return (
    <>
      <div class="marquee">
        <div>
          <div>
            Quick heads-up, gamers! 🎮 Our AWS lightsail needs a short nap (and
            my wallet a refill 💸). Game's on a tiny break until payday swoops
            in! 🦸‍♂️ Sorry for the pause, we'll be back soon! 🚀
          </div>
        </div>
      </div>

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

          <Button
            variant="outline-secondary"
            size="lg"
            onClick={() => ResetChess()}
          >
            Restart
          </Button>

          <Button size="lg" variant="light">
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
    </>
  );
}
