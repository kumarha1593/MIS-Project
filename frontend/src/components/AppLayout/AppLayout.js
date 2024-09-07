import React from "react";
import UserMenu from "../UserMenu/UserMenu";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <header className="app-header">
        <img src="/logo.png" alt="logo" className="logo" />
        <UserMenu />
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
};

export default AppLayout;
