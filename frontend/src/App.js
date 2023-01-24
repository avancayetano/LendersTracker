import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/user-auth-context";
import { AppMetaContextProvider } from "./context/app-meta-context";
import OthersTransactionsPage from "./pages/OthersTransactionsPage";
import LoanTransactionsPage from "./pages/LoanTransactionsPage";
import LoanDetailsPage from "./pages/LoanDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import MembersPage from "./pages/MembersPage";

function App() {
  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <UserAuthContextProvider>
        <AppMetaContextProvider>
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
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/register"
              element={
                <ProtectedRoute>
                  <RegisterPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/members"
              element={
                <ProtectedRoute>
                  <MembersPage />
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
              path="/dashboard/transactions/:loanId"
              element={
                <ProtectedRoute>
                  <LoanDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/others-transactions"
              element={
                <ProtectedRoute>
                  <OthersTransactionsPage />
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
