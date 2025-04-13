import React, { useState } from "react";
import "./FilterPanel.css";

const FilterPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    bedrooms: "",
    bathrooms: "",
    parking: "",
    priceRange: "",
    locality: "",
    TypeofHouse: "",
    amenities: "",
    size: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Bedrooms</label>
        <select name="bedrooms" value={filters.bedrooms} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Bathrooms</label>
        <select name="bathrooms" value={filters.bathrooms} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Parking</label>
        <select name="parking" value={filters.parking} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Type of House</label>
        <select name="TypeofHouse" value={filters.TypeofHouse} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Bungalow">Bungalow</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <select name="priceRange" value={filters.priceRange} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="1">Up to ₹50,00,000</option>
          <option value="2">₹50,00,000 - ₹1,00,00,000</option>
          <option value="3">₹1,00,00,000 - ₹2,00,00,000</option>
          <option value="4">₹2,00,00,000 - ₹5,00,00,000</option>
          <option value="5">Above ₹5,00,00,000</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Locality</label>
        <select name="locality" value={filters.locality} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="byculla">Byculla</option>
          <option value="wadala">Wadala</option>
          <option value="worli">Worli</option>
          <option value="dadar">Dadar</option>
          <option value="parel">Parel</option>
          <option value="matunga">Matunga</option>
          <option value="mahim">Mahim</option>
          <option value="mumbai_central">Mumbai Central</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Amenities</label>
        <select name="amenities" value={filters.amenities} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="pool">Swimming Pool</option>
          <option value="gym">Gym</option>
          <option value="garden">Garden</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Size</label>
        <select name="size" value={filters.size} onChange={handleInputChange}>
          <option value="">Any</option>
          <option value="500">Up to 500 sq. ft.</option>
          <option value="1000">500 - 1000 sq. ft.</option>
          <option value="1500">1000 - 1500 sq. ft.</option>
          <option value="2000">1500 - 2000 sq. ft.</option>
          <option value="2500">2000 - 2500 sq. ft.</option>
          <option value="3000">Above 2500 sq. ft.</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;