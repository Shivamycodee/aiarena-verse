// src/api/move.js

export const newGame = async (game_token) => {
  try {
    const response = await fetch(
      "https://shivamycode.pythonanywhere.com/new_game",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ game_token }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to make move:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("An error occurred while reseting game:", error);
    return null;
  }
};

export const makeMove = async (index, game_token) => {
  try {
    const response = await fetch("https://shivamycode.pythonanywhere.com/move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index: index, game_token: game_token }),
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

export const makeChessMove = async (move, game_token) => {
  try {
    const response = await fetch(
      "http://ec2-51-20-83-57.eu-north-1.compute.amazonaws.com:5000/make_move",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ move: move, game_token: game_token }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("An error occurred while making a move:", error);
    return null;
  }
};

export const boardReset = async (old_game_token, game_token) => {
  try {
    // http://ec2-51-20-83-57.eu-north-1.compute.amazonaws.com:5000
    const response = await fetch(
      "http://ec2-51-20-83-57.eu-north-1.compute.amazonaws.com:5000/board_reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_token: game_token,
          old_game_token: old_game_token,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("An error occurred while making a move:", error);
    return null;
  }
};
