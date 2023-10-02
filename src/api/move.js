// src/api/move.js

export const newGame = async (game_token) => {
  try {
  const response = await fetch("https://shivamycode.pythonanywhere.com/new_game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ game_token }),
  });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to make move:", response.statusText);
      return null;
    }
  
  }catch (error) {
    console.error("An error occurred while reseting game:", error);
    return null;
  }
}

export const makeMove = async (index,game_token) => {
  try {
    const response = await fetch("https://shivamycode.pythonanywhere.com/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "index":index, "game_token":game_token }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to make move:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("An error occurred while making a move:", error);
    return null;
  }
};


export const makeChessMove = async (move) => {
  try {
    const response = await fetch("http://127.0.0.1:5001/make_move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ move }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }
  catch (error) {
    console.error("An error occurred while making a move:", error);
    return null;
  }
}


export const GameEnd = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5001/game_end", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("An error occurred while making a move:", error);
    return null;
  }
}


