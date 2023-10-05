from flask import Flask, jsonify, request
from flask_cors import CORS
import chess
import tensorflow as tf
import numpy as np


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load your Keras model
model = tf.keras.models.load_model("./keras_model_02_final")

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model)
tflite_model = converter.convert()


global chessboard
chessboard = {}

# Save the TFLite model
with open('model.tflite', 'wb') as f:
    f.write(tflite_model)

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



# Load TFLite model and allocate tensors
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

def predict_with_tflite(input_data):

    # Make prediction
    interpreter.set_tensor(input_details[0]['index'], np.array([input_data], dtype=np.float32))
    interpreter.invoke()
    prediction = interpreter.get_tensor(output_details[0]['index'])
    return prediction


@app.route('/')
def index():
    return "It's working!"



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
            score = predict_with_tflite(input_data)
            
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
     app.run(host="0.0.0.0",debug=True)
    