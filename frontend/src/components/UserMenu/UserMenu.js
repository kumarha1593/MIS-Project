import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import "./UserMenu.css";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="user-menu-container">
      <FaUser onClick={toggleMenu} className="user-icon" />
      {isOpen && (
        <div className="user-menu-dropdown">
          <button onClick={() => console.log("Home clicked")}>Home</button>
          <button onClick={() => console.log("Logout clicked")}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
