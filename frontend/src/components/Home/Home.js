import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [formData, setFormData] = useState({
    district: "",
    village: "",
    healthFacility: "",
    moName: "",
    ashaName: "",
    midoriStaff: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { district, village, healthFacility } = formData;

    if (!district || !village || !healthFacility) {
      alert("All fields are mandatory");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/saveUserDetails", {
        district,
        village,
        healthFacility,
      });
      // Redirect to the next page or show a success message
      navigate("/FieldDashboard"); // Adjust according to your routing setup
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="home-container">
      <h2>Fill these details before proceeding</h2>
      <form onSubmit={handleSubmit} className="details-form">
        <div className="form-group">
          <label>District*</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Village*</label>
          <input
            type="text"
            name="village"
            value={formData.village}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Health Facility Name*</label>
          <input
            type="text"
            name="healthFacility"
            value={formData.healthFacility}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Name of MO*</label>
          <input
            type="text"
            name="moName"
            value={formData.moName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Name of Asha*</label>
          <input
            type="text"
            name="ashaName"
            value={formData.ashaName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Midori Staff Name*</label>
          <input
            type="text"
            name="midoriStaff"
            value={formData.midoriStaff}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="save-proceed-button">
          Save & Proceed
        </button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Error Modal"
        className="error-modal"
        overlayClassName="error-modal-overlay"
      >
        <h2>All fields are mandatory</h2>
        <button onClick={closeModal} className="close-modal-button">
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Home;
