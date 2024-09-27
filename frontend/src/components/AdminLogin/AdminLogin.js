import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css"; // We'll create this file next
import defaultInstance from "../../axiosHelper";
import { API_ENDPOINTS } from "../../utils/apiEndPoints";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
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

  const onSubmit = async (evt) => {
    evt.preventDefault();
    if (formData?.email !== "admin@gmail.com") {
      setError("Invalid email or password");
    }
    const apiPayload = { email: formData?.email, password: formData?.password };
    try {
      const response = await defaultInstance.post(
        API_ENDPOINTS.LOGIN,
        apiPayload
      );
      if (response?.data?.token) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("user_id", response?.data?.user_id);
        navigate("/admin-home");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-container">
        <form className="admin-login-form" onSubmit={onSubmit}>
          <h2>Admin Sign In</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              placeholder="Enter Your Email"
              required
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
          <button
            type="submit"
            className="admin-login-button"
            onClick={onSubmit}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
