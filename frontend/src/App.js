import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import FieldDashboard from "./components/FieldDashboard/FieldDashboard";
import FormPage from "./components/FormPage/FormPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/FieldDashboard" element={<FieldDashboard />} />
          <Route path="/FormPage" element={<FormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
