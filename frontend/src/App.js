import React from "react";
import { Routes, Route } from "react-router-dom";

import IndexPage from "./pages/Index";
import DashboardPage from "./pages/Dashboard";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<IndexPage />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
