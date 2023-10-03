import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TicTacToe from './tictactoe'
import Chess from './chessboard'
import "../index.css";
import Parallax from "../components/parallax";
import AiVsAi from './aivsai';
import HumanVsAi from './humanVsAi';
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
          <Route path="humanvsai/tictactoe" element={<TicTacToe />} />
          <Route path="humanvsai/chessboard" element={<Chess />} />
          <Route path="humanvsai" element={<HumanVsAi />} />
          <Route path="aivsai" element={<AiVsAi />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
