import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import defaultInstance from "../../axiosHelper";
import { API_ENDPOINTS } from "../../utils/apiEndPoints";
import { ROLE_TYPE } from "../../utils/helper";
import moment from 'moment';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (evt) => {
    evt.preventDefault();
    const apiPayload = { email, password }
    try {
      const response = await defaultInstance.post(API_ENDPOINTS.LOGIN, apiPayload);
      if (response?.data?.token) {
        const date = moment().format('YYYY-MM-DD')
        const userData = response?.data?.user_info;
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("user_id", response?.data?.user_id);
        const roleNavigationMap = {
          'Field Coordinator': response?.data?.hasDistrictInfo ? "/FieldDashboard" : "/home",
          'State Coordinator': `/users?role_type=${ROLE_TYPE.STATE_COORDINATOR}&from_date=${date}&to_date=${date}&search_term=&page_limit=20&skip_count=&status=1`,
          'Assistant State Coordinator': `/users?role_type=${ROLE_TYPE.ASSISTANT_STATE_COORDINATOR}&from_date=${date}&to_date=${date}&search_term=&page_limit=20&skip_count=&status=1`,
          'Zonal Manager': `/users?role_type=${ROLE_TYPE.ZONAL_MANAGER}&from_date=${date}&to_date=${date}&search_term=&page_limit=20&skip_count=&status=1`,
          'Supervisor': `/users?role_type=${ROLE_TYPE.SUPER_VISOR}&from_date=${date}&to_date=${date}&search_term=&page_limit=20&skip_count=&status=1`,
          'admin': `admin-home`,
        };

        const defaultPath = "/home";
        const rolePath = roleNavigationMap[userData?.role] || defaultPath;

        navigate(rolePath);

      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Sign In</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            required
          />
        </div>
        <div className="form-group">
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        <div className="form-group">
          <a href="/forgot-password" className="forgot-password-link">
            Forget Password?
          </a>
        </div>
        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
