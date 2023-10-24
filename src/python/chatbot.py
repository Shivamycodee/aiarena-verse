from transformers import GPT2LMHeadModel, GPT2Tokenizer,TFGPT2Model,TFGPT2LMHeadModel
import torch
from flask import Flask, jsonify, request
from flask_cors import CORS

tokenizer = GPT2Tokenizer.from_pretrained('gpt2-large')
model = TFGPT2LMHeadModel.from_pretrained('gpt2-large')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def index():
    return "API IS RUNNING" , 200


@app.route('/get_answer', methods=['POST','OPTIONS'])
def Answer():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200
    input_text = request.json.get('input_text')
    if not input_text:
        return jsonify({"error": "input_text not provided"}), 400
    print("error here...")
    input_ids = tokenizer.encode(input_text, return_tensors='pt')
    attention_mask = torch.ones(input_ids.shape, dtype=torch.long)
    encodeOutput = model.generate(input_ids, max_length=200, no_repeat_ngram_size=2, attention_mask=attention_mask)
    decodeOutput = tokenizer.decode(encodeOutput[0], skip_special_tokens=True)
    return jsonify({"message": decodeOutput}), 200


if __name__ == '__main__':
    app.run(debug=True)
