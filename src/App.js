import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Breakout from "./games/breakout/index";
import { ConnectButton, useActiveWalletConnectionStatus } from "thirdweb/react";
import { client } from "./client";
import Wapp from "./Wapp";

// Wrapper to use hooks inside router
function AppRoutes() {
  const status = useActiveWalletConnectionStatus();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "connected") {
      navigate("/game");
    } else if (status === "disconnected") {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Wapp />} />
      <Route path="/game" element={<Breakout />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;
