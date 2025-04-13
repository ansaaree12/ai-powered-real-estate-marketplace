// RE/src/virtualTour/VirtualTour.jsx
import React from "react";
import PropTypes from "prop-types";
import './VirtualTour.css';

const VirtualTour = ({ virtualTourFolder, onClose }) => {
  const tourUrl = `/virtual-tour/${virtualTourFolder}/index.html`;  // Path to the virtual tour folder

  return (
    <div className="virtual-tour-overlay">
      <div className="virtual-tour-container">
        <button className="close-button" onClick={onClose}>X</button>
        <iframe
          src={tourUrl}
          width="100%"
          height="100%"
          title="Virtual Tour"
          frameBorder="0"
        ></iframe>
      </div>
    </div>
  );
};

VirtualTour.propTypes = {
  virtualTourFolder: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VirtualTour;
