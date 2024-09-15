import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css"; // We'll create this file next

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/admin/login`,
        formData
      );
      navigate("/admin-home");
      if (response.data.success) {
        alert("Login successful");
        // Store token or proceed with navigation
        localStorage.setItem("token", response.data.token);
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Admin login error:", err.response || err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={handleLogin}>
          <h2>Admin Sign In</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          {/* <div className="form-group">
            <a href="/admin-forgot-password" className="forgot-password-link">
              Forget Password?
            </a>
          </div> */}
          <button
            type="submit"
            className="admin-login-button"
            onClick={handleLogin}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
