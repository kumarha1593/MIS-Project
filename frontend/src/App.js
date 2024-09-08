import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import FieldDashboard from "./components/FieldDashboard/FieldDashboard";
import FormPage from "./components/FormPage/FormPage";
import AppLayout from "./components/AppLayout/AppLayout";
import ReviewPage from "./components/Review/Review";
import FamilyDetails from "./components/FamilyDetails/FamilyDetails";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminHomePage from "./components/AdminHomePage/AdminHomePage";
import AdminFormPage from "./components/AdminFormPage/AdminFormPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-home" element={<AdminHomePage />} />
          <Route path="/admin-form" element={<AdminFormPage />} />
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
            path="/family-details/:headId"
            element={
              <AppLayout>
                <FamilyDetails />
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
