from flask import Flask, jsonify, request
from flask_cors import CORS
import chess
import tensorflow as tf
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

global oxgames
oxgames = {}

global chessboard
chessboard = {}


@app.route("/")
def index():
    return "API IS RUNNING", 200


@app.route("/new_game", methods=["POST", "OPTIONS"])
def new_game():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    game_token = request.json.get("game_token")
    if not game_token:
        return jsonify({"error": "Game token not provided"}), 400

    oxgames[game_token] = [None for _ in range(9)]  # Initialize plate
    return jsonify({"message": "New game started"}), 200


def is_winner(plate, symbol):
    for row in range(0, 9, 3):
        if all([cell == symbol for cell in plate[row : row + 3]]):
            return True
    for col in range(3):
        if all([plate[row + col] == symbol for row in range(0, 9, 3)]):
            return True
    if all([plate[i] == symbol for i in [0, 4, 8]]):
        return True
    if all([plate[i] == symbol for i in [2, 4, 6]]):
        return True
    return False


def is_full(plate):
    return all(cell is not None for cell in plate)


def minimax(plate, depth, maximizing, alpha, beta):
    winx = is_winner(plate, "X")
    wino = is_winner(plate, "O")
    if winx:
        return 10 - depth
    if wino:
        return depth - 10
    if is_full(plate):
        return 0

    if maximizing:
        max_eval = float("-inf")
        for i in range(9):
            if plate[i] is None:
                plate[i] = "X"
                eval = minimax(plate, depth + 1, False, alpha, beta)
                plate[i] = None
                max_eval = max(max_eval, eval)
                if beta <= alpha:
                    break
        return max_eval
    else:
        min_eval = float("inf")
        for i in range(9):
            if plate[i] is None:
                plate[i] = "O"
                eval = minimax(plate, depth + 1, True, alpha, beta)
                plate[i] = None
                min_eval = min(min_eval, eval)
                if beta <= alpha:
                    break
        return min_eval


def best_move(plate):
    alpha = float("-inf")
    beta = float("inf")

    max_eval = float("-inf")
    move = None
    for i in range(9):
        if plate[i] is None:
            plate[i] = "X"
            eval = minimax(plate, 0, False, alpha, beta)
            plate[i] = None
            if eval > max_eval:
                max_eval = eval
                move = i
    return move


@app.route("/move", methods=["POST", "OPTIONS"])
def make_move():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    game_token = request.json.get("game_token")
    if not game_token or game_token not in oxgames:
        return jsonify({"error": "Invalid game token"}), 400

    plate = oxgames[game_token]
    index = int(request.json["index"])
    plate[index] = "O"

    if is_winner(plate, "O"):
        oxgames.pop(game_token, None)
        return jsonify({"winner": "O"})

    if is_full(plate):
        oxgames.pop(game_token, None)
        return jsonify({"winner": "tie"})

    ai_move = best_move(plate)
    plate[ai_move] = "X"

    if is_winner(plate, "X"):
        oxgames.pop(game_token, None)
        return jsonify({"winner": "X", "ai_move": ai_move})

    if is_full(plate):
        oxgames.pop(game_token, None)
        return jsonify({"winner": "tie"})

    return jsonify({"ai_move": ai_move})


def initialize_game():
    # Set up your game plate and other state variables
    plate = [[" "] * 3 for _ in range(3)]
    current_player = "O"
    game_over = False
    return plate, current_player, game_over


# CHESS CODE: ♜♞♝♛♚♝♞♜


# Load your trained model
model = tf.keras.models.load_model("./keras_model_02_final")


def board_to_input_format(board):
    piece_mapping = {
        None: [0, 0, 0],
        "P": [0, 0, 1],
        "R": [0, 1, 0],
        "N": [0, 1, 1],
        "B": [1, 0, 0],
        "Q": [1, 0, 1],
        "K": [1, 1, 0],
        "p": [0, 0, -1],
        "r": [0, -1, 0],
        "n": [0, -1, -1],
        "b": [-1, 0, 0],
        "q": [-1, 0, -1],
        "k": [-1, -1, 0],
    }
    input_data = []
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            input_data.extend(piece_mapping[piece.symbol()])
        else:
            input_data.extend(piece_mapping[None])
    return np.array(input_data, dtype=np.float32)


@app.route("/board_reset", methods=["POST", "OPTIONS"])
def board_reset():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200
    
    if request.json.get("old_game_token"):
        old_game_token = request.json.get("old_game_token")
        chessboard.pop(old_game_token, None)

    game_token = request.json.get("game_token")
    if not game_token:
        return jsonify({"error": "Game token not provided"}), 400

    chessboard[game_token] = chess.Board()  # Initialize plate
    return jsonify({"message": "😎 Game has been reset"}), 200


@app.route("/make_move", methods=["POST", "OPTIONS"])
def chess_move():
    if request.method == "OPTIONS":
        return jsonify({"status": "OK"}), 200

    game_token = request.json.get("game_token")
    if not game_token:
        return jsonify({"error": "Invalid game token"}), 400

    if chessboard[game_token].turn:  # True for White, False for Black
        move_uci = request.json.get("move")
        if not move_uci:
            return jsonify({"error": "Move not provided"}), 400
        move = chess.Move.from_uci(move_uci)
        if move not in chessboard[game_token].legal_moves:
            return jsonify({"error": "Illegal move"}), 400
        chessboard[game_token].push(move)

        # Black's turn (model's move)
        best_move = None
        best_score = -np.inf
        for move in chessboard[game_token].legal_moves:
            chessboard[game_token].push(move)
            input_data = board_to_input_format(chessboard[game_token])
            score = model.predict(np.array([input_data]))
            chessboard[game_token].pop()
            if score > best_score:
                best_move = move
                best_score = score
        print("AI MOVE : ", best_move)
        chessboard[game_token].push(best_move)
        return jsonify({"move": str(best_move)})

    else:
        return jsonify({"error": "Not white's turn"}), 400


if __name__ == "__main__":
    app.run(debug=True)
