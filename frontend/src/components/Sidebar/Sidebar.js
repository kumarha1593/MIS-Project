import React from "react";
import "./Sidebar.css";

const SidebarModal = ({
  isOpen,
  onClose,
  sections,
  currentSection,
  onSectionChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="sidebar-modal-overlay">
      <div className="sidebar-modal">
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
    </div>
  );
};

export default SidebarModal;
