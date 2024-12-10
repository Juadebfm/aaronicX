import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { AuthProvider, AuthStateProvider } from "./context/authcontext";
import Signup from "./pages/Signup";
import CheckEmail from "./pages/CheckEmail";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <div className="font-figtree">
      <AuthProvider>
        <AuthStateProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
          </Router>
        </AuthStateProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
