import React from "react";
import UserMenu from "../UserMenu/UserMenu";
import "./AppLayout.css";
import logo from "../../assests/logo.png";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const AppLayout = ({ children, hideFamily = false }) => {

  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <header className="top-header">
        <IoArrowBack className='back-btn' onClick={() => navigate(-1)} />
        <img src={logo} alt="logo" className="logo" />
        <UserMenu hideFamily={hideFamily} />
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default AppLayout;
