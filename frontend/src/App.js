import React from "react";
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

import { UserAuthContextProvider } from "./context/user-auth-context";
import { AppMetaContextProvider } from "./context/app-meta-context";
import SearchPage from "./pages/SearchPage";
import LoanTransactionsPage from "./pages/LoanTransactionsPage";
import LoanDetailsPage from "./pages/LoanDetailsPage";

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
            <Route
              path="/dashboard/search"
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/transactions"
              element={
                <ProtectedRoute>
                  <LoanTransactionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/transactions/:loanId/"
              element={
                <ProtectedRoute>
                  <LoanDetailsPage />
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
