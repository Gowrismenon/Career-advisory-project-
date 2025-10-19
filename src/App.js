
import logo from './logo.svg';
import './App.css';
import Chat from './Chat.js'
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployeeLogin from "./login.js";
import Dashboard from "./Dash.js";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedInEmployee');
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<EmployeeLogin />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/Chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

