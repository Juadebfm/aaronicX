import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import CheckEmail from "./pages/CheckEmail";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/authcontext";

const App = () => {
  return (
    <div className="font-figtree">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/check-email" element={<CheckEmail />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
