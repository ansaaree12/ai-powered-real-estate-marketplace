import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge, Button } from "antd";
import { PuffLoader } from "react-spinners";
import SearchBar from "../../components/SearchBar/SearchBar";
import useProperties from "../../hooks/useProperties";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import "./Properties.css";
import { compareProperties } from "../../utils/api"; // ✅ Correct import

// 🏅 Badge Colors
const getBadge = (ranking_score) => {
  const colors = {
    10: "#FFD700",
    9: "#FF8C00",
    8: "#C0C0C0",
    7: "#A9A9A9",
    6: "#CD7F32",
    5: "#8B4513",
    4: "#4169E1",
    3: "#1E90FF",
    2: "#32CD32",
    1: "#FF4500",
  };
  return {
    text: `🏅 ${ranking_score}`,
    color: colors[ranking_score] || "gray",
  };
};

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const navigate = useNavigate();

  // ✅ Clear compare list on refresh (without affecting hearts or other data)
  useEffect(() => {
    localStorage.removeItem("compareList");
    console.log("🔄 Compare list cleared on page refresh.");
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilterCriteria(newFilters);
  };

  const getSizeInSqFt = (sizeStr) => {
    if (!sizeStr) return 0;
    const numericValue = parseFloat(sizeStr.replace(/[^0-9.]/g, ""));
    return isNaN(numericValue) ? 0 : numericValue;
  };

  const getSizeRange = (sizeOption) => {
    switch (sizeOption) {
      case "500":
        return { min: 0, max: 500 };
      case "1000":
        return { min: 500, max: 1000 };
      case "1500":
        return { min: 1000, max: 1500 };
      case "2000":
        return { min: 1500, max: 2000 };
      case "2500":
        return { min: 2000, max: 2500 };
      case "3000":
        return { min: 2500, max: Infinity };
      default:
        return { min: 0, max: Infinity };
    }
  };

  const filterProperties = (property) => {
    const {
      bedrooms,
      bathrooms,
      parking,
      priceRange,
      locality,
      amenities,
      TypeofHouse,
      size,
    } = filterCriteria;

    const priceLimits = {
      1: [0, 5000000],
      2: [5000000, 10000000],
      3: [10000000, 20000000],
      4: [20000000, 50000000],
      5: [50000000, Infinity],
    };

    const priceFilter = priceRange
      ? property.price >= priceLimits[priceRange][0] &&
        property.price <= priceLimits[priceRange][1]
      : true;

    const amenitiesFilter = amenities
      ? property.amenities && property.amenities.includes(amenities)
      : true;

    const propertySizeInSqFt = getSizeInSqFt(property.size);
    const sizeRange = getSizeRange(size);
    const sizeFilter = size
      ? propertySizeInSqFt >= sizeRange.min &&
        propertySizeInSqFt <= sizeRange.max
      : true;

    return (
      (!bedrooms || property.facilities?.bedrooms === parseInt(bedrooms)) &&
      (!bathrooms || property.facilities?.bathrooms === parseInt(bathrooms)) &&
      (!parking || property.facilities?.parkings === parseInt(parking)) &&
      (!TypeofHouse || property.TypeofHouse === TypeofHouse) &&
      (!locality ||
        property.address.toLowerCase().includes(locality.toLowerCase())) &&
      priceFilter &&
      amenitiesFilter &&
      sizeFilter &&
      (filter
        ? property.title.toLowerCase().includes(filter.toLowerCase()) ||
          property.city.toLowerCase().includes(filter.toLowerCase()) ||
          property.country.toLowerCase().includes(filter.toLowerCase())
        : true)
    );
  };

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#4066ff"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <SearchBar filter={filter} setFilter={setFilter} />
        <FilterPanel onFilterChange={handleFilterChange} />
        <div className="paddings properties-flex-center properties">
          {data.filter(filterProperties).map((card, i) => {
            const badge = getBadge(card.ranking_score);
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="property-motion-container"
              >
                <Badge.Ribbon
                  text={badge.text}
                  color={badge.color}
                  placement="start"
                  className="property-badge"
                >
                  <PropertyCard card={card} />
                </Badge.Ribbon>
              </motion.div>
            );
          })}
        </div>

        <div
          className="compare-button-container"
          style={{ textAlign: "center", marginTop: "2rem" }}
        >
          <Button
            type="primary"
            onClick={async () => {
              let selectedProperties =
                JSON.parse(localStorage.getItem("compareList")) || [];

              if (!Array.isArray(selectedProperties)) {
                console.error(
                  "❌ selectedProperties is not an array:",
                  selectedProperties
                );
                selectedProperties = [];
              }

              selectedProperties = selectedProperties.map((id) =>
                id.toString()
              ); // Convert IDs to strings

              if (selectedProperties.length < 2) {
                alert("Select at least two properties for comparison!");
                return;
              }

              try {
                // ✅ Send only an array of property IDs (fix API call)
                await compareProperties(selectedProperties);

                // ✅ Navigate to the compare page only after API call succeeds
                navigate("/compare-page");
              } catch (error) {
                console.error("❌ Comparison API Error:", error);
              }
            }}
          >
            Compare Selected Properties
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Properties;
