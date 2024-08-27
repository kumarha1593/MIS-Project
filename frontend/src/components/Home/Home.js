import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchMidoriStaffName = async () => {
      const user_id = localStorage.getItem("user_id");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/${user_id}`
        );
        setFormData((prevState) => ({
          ...prevState,
          midoriStaff: response.data.name,
        }));
      } catch (error) {
        console.error("Error fetching Midori staff name:", error);
      }
    };

    fetchMidoriStaffName();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user_id = localStorage.getItem("user_id");
    const currentDate = new Date().toISOString();

    const submitData = {
      user_id,
      district: formData.district,
      village: formData.village,
      health_facility: formData.healthFacility,
      mo_mpw_cho_anu_name: formData.moName,
      asha_name: formData.ashaName,
      midori_staff_name: formData.midoriStaff,
      date: currentDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/district_info",
        submitData
      );
      if (response.data.success) {
        navigate("/FieldDashboard");
      } else {
        console.error("Data was not saved successfully");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
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
