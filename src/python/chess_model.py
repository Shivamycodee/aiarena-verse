from flask import Flask, request, jsonify
from flask_cors import CORS
import chess
import tensorflow as tf
import numpy as np



app = Flask(__name__)
CORS(app)

# Load your trained model
model = tf.keras.models.load_model("./keras_model_02_final")

global board
board = chess.Board()

def board_to_input_format(board):
    piece_mapping = {
        None: [0, 0, 0],
        'P': [0, 0, 1],
        'R': [0, 1, 0],
        'N': [0, 1, 1],
        'B': [1, 0, 0],
        'Q': [1, 0, 1],
        'K': [1, 1, 0],
        'p': [0, 0, -1],
        'r': [0, -1, 0],
        'n': [0, -1, -1],
        'b': [-1, 0, 0],
        'q': [-1, 0, -1],
        'k': [-1, -1, 0]
    }
    
    input_data = []
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            input_data.extend(piece_mapping[piece.symbol()])
        else:
            input_data.extend(piece_mapping[None])
    return np.array(input_data, dtype=np.float32)



@app.route('/make_move', methods=['POST'])
def make_move():
    
    if board.turn:  # True for White, False for Black
        move_uci = request.json.get("move")
        if not move_uci:
            return jsonify({"error": "Move not provided"}), 400
        move = chess.Move.from_uci(move_uci)
        if move not in board.legal_moves:
            return jsonify({"error": "Illegal move"}), 400
        board.push(move)
        
        # Black's turn (model's move)
        best_move = None
        best_score = -np.inf
        for move in board.legal_moves:
            board.push(move)
            input_data = board_to_input_format(board)
            score = model.predict(np.array([input_data]))
            board.pop()
            if score > best_score:
                best_move = move
                best_score = score
        print("AI MOVE : ",best_move)
        board.push(best_move)
        return jsonify({"move": str(best_move)})

    else:
        return jsonify({"error": "Not white's turn"}), 400
    
    
    
@app.route("/game_end",methods=["POST"])
def game_end():
    
        global board
        board = chess.Board()
        return jsonify({"message": "😎 Game has been reset"}), 200

    

if __name__ == "__main__":
    app.run(debug=True)
    