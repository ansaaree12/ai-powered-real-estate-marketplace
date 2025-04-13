import React, { useState, useEffect } from "react";
import "./PropertyCard.css";
import { truncate } from "lodash";
import { useNavigate } from "react-router-dom";
import Heart from "../Heart/Heart";

const PropertyCard = ({ card, children }) => {
  const navigate = useNavigate();
  
  // Retrieve saved compare list from localStorage
  const storedCompareList = JSON.parse(localStorage.getItem("compareList")) || [];
  const [isChecked, setIsChecked] = useState(storedCompareList.includes(card.id));

  useEffect(() => {
    // Update localStorage when isChecked changes
    const updatedCompareList = JSON.parse(localStorage.getItem("compareList")) || [];
    
    if (isChecked && !updatedCompareList.includes(card.id)) {
      updatedCompareList.push(card.id);
    } else if (!isChecked) {
      const index = updatedCompareList.indexOf(card.id);
      if (index !== -1) {
        updatedCompareList.splice(index, 1);
      }
    }
    
    localStorage.setItem("compareList", JSON.stringify(updatedCompareList));
  }, [isChecked, card.id]);

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsChecked(!isChecked);
  };

  return (
    <div
      className="flexColStart r-card"
      onClick={() => navigate(`../properties/${card.id}`)}
    >
      
      {/* Heart should stay in the top-right corner inside the image */}
      <div className="heart-container">
        <Heart id={card?.id} />
      </div>

      {/* Property image */}
      <img src={card.image} alt="Property" className="property-image" />

      {/* Price */}
      <span className="secondaryText r-price">
        <span style={{ color: "orange" }}>₹</span>
        <span>{card.price}</span>
      </span>

      {/* Title */}
      <span className="primaryText">
        {truncate(card.title, { length: 15 })}
      </span>

      {/* Description */}
      <span className="secondaryText">
        {truncate(card.description, { length: 80 })}
      </span>

      {/* Additional Content (e.g., Virtual Tour Button) */}
      {children}

      {/* Select to Compare Checkbox (Bottom-Left Corner) */}
      <div className="compare-checkbox-container" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxClick}
        />
        <label>Compare</label>
      </div>
    </div>
  );
};

export default PropertyCard;
