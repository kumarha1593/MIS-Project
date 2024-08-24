import React from "react";
import "./Sidebar.css";

const Sidebar = ({
  isOpen,
  onClose,
  sections,
  currentSection,
  onSectionChange,
}) => {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Sections</h3>
        <ul>
          {sections.map((section, index) => (
            <li
              key={index}
              className={currentSection === section ? "active" : ""}
              onClick={() => {
                onSectionChange(section);
                onClose();
              }}
            >
              {section}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
