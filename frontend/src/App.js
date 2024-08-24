import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import FieldDashboard from "./components/FieldDashboard/FieldDashboard";
import FormPage from "./components/FormPage/FormPage";
import AppLayout from "./components/AppLayout/AppLayout"; // Import the new AppLayout
import ReviewPage from "./components/Review/Review";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="/FieldDashboard"
            element={
              <AppLayout>
                <FieldDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/FormPage"
            element={
              <AppLayout>
                <FormPage />
              </AppLayout>
            }
          />
          <Route
            path="/Review"
            element={
              <AppLayout>
                <ReviewPage />
              </AppLayout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
