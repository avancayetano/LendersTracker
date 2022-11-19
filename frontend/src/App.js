import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { UserAuthContextProvider } from "./context/user-auth-context";
import { AppMetaContextProvider } from "./context/app-meta-context";

function App() {
  return (
    <>
      <UserAuthContextProvider>
        <AppMetaContextProvider>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppMetaContextProvider>
      </UserAuthContextProvider>
    </>
  );
}

export default App;
