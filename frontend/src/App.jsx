import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthProvider } from "./context/authcontext";

const App = () => {
  return (
    <div className="font-figtree">
      <AuthProvider>
        <Router>
          <Routes>
            <Route>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
