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

    const { email, password } = formData;
    const apiPayload = { email, password };

    try {
      const { data } = await defaultInstance.post(API_ENDPOINTS.LOGIN, apiPayload);

      if (data?.token) {
        const { role, user_id } = data.user_info || {};

        if (role === 'admin') {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", user_id);
          navigate('/admin-home');
        } else {
          setError("You are not allowed to access this page");
        }
      } else {
        setError("Invalid email or password");
      }

    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred. Please try again.");
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
