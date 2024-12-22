// src/routes.tsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Solo from "./pages/SoloPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Battle from "./pages/Battle";
import Collab from "./pages/Collab";
import Landing from "./pages/Landing";

const RoutesConfig: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/solo" element={<Solo />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/pair" element={<Collab />} />
      </Routes>
    </Router>
  );
};

export default RoutesConfig;
