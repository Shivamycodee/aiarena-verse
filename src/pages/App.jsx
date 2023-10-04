import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import TicTacToe from './tictactoe'
import Chess from './chessboard'
import "../index.css";
import Parallax from "../components/parallax";
import HumanWithAI from './humanWithAi';
import AiVsAi from './aivsai';
import NoPage from './nopage';

function Home() {
  return (
    <div id="full-body">
      <Parallax />
    </div>
  );
}

function App() {
  return (
    <div id="full-body">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} /> {/* Use Home here */}
          <Route path="humanWithAi/tictactoe" element={<TicTacToe />} />
          <Route path="humanWithAi/chessboard" element={<Chess />} />
          <Route path="humanWithAi" element={<HumanWithAI />} />
          <Route path="aivsai" element={<AiVsAi />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
