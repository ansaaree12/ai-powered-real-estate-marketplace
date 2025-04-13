import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { compareProperties } from "../utils/api";
import {
  Grid, Card, CardMedia, CardContent, Typography, CircularProgress,
  Alert, LinearProgress, Button, Box, Tooltip
} from "@mui/material";

import { motion } from "framer-motion";
import { Home, LocationOn, AttachMoney, CheckCircle } from "@mui/icons-material";
import "./ComparePage.css";

const cardColors = ["#E3F2FD", "#EDE7F6", "#E0F2F1", "#FFEBEE", "#FFF3E0", "#E8F5E9"];

const ComparePage = () => {
  const navigate = useNavigate();
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        let selectedProperties = JSON.parse(localStorage.getItem("compareList")) ?? [];
        if (!Array.isArray(selectedProperties)) selectedProperties = [];
        selectedProperties = selectedProperties.map(id => id.toString());

        if (selectedProperties.length < 2) {
          alert("You must select at least two properties to compare.");
          navigate("/properties");
          return;
        } else if (selectedProperties.length > 3) {
          alert("You can only compare up to 3 properties at a time.");
          navigate("/properties");
          return;
        }

        const response = await compareProperties(selectedProperties);
        setComparisonData(response);
      } catch (error) {
        setError("Something went wrong while fetching comparison data.");
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [navigate]);

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress size={60} thickness={5} sx={{ color: "#2196F3" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "#1976D2", fontFamily: "Poppins, sans-serif" }}>
          Fetching Properties...
        </Typography>
      </Box>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!comparisonData || !comparisonData.properties || comparisonData.properties.length === 0) {
    return <Alert severity="info">No properties available for comparison.</Alert>;
  }

  const propertyAIMap = new Map(comparisonData.scores || []);
  const bestProperty = comparisonData.properties.reduce((prev, curr) =>
    propertyAIMap.get(curr._id) > propertyAIMap.get(prev._id) ? curr : prev, comparisonData.properties[0]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <Box className="compare-page">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="compare-header"
        >
          <Typography variant="h3" fontWeight="bold" sx={{ textShadow: "0px 3px 10px rgba(0,0,0,0.3)", fontFamily: "Poppins, sans-serif" }}>
            Property Comparison
          </Typography>
        </motion.div>

        {bestProperty && propertyAIMap.has(bestProperty._id) && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1.05, 1] }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            <Box sx={{
              textAlign: "center",
              mt: 3, mb: 3, px: 4, py: 2,
              backgroundColor: "#1565C0",
              color: "white",
              borderRadius: 3,
              fontWeight: "bold",
              boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
              fontFamily: "Poppins, sans-serif"
            }}>
              Best Property: <strong>{bestProperty.title}</strong> (AI Score: {Math.round(propertyAIMap.get(bestProperty._id))}%)
            </Box>
          </motion.div>
        )}

        <Grid container spacing={4} justifyContent="center" alignItems="stretch" className="compare-row">
          {comparisonData.properties.map((property, index) => {
            const aiScore = Math.round(propertyAIMap.get(property._id) || 0);
            const aiData = comparisonData.ai_insights?.[index] || {};
            const insights = aiData.insights || "No AI insights available.";
            const viewUrl = aiData.view_url || `/properties/${property._id}`;
            const cardBgColor = cardColors[index % cardColors.length];

            return (
              <Grid item xs={12} sm={6} md={4} key={property._id} display="flex">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.03 }}
                  className={`property-card ${property._id === bestProperty._id ? "selected-property" : ""}`}
                >
                  <Card className="full-height-card" sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                    background: cardBgColor,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                    transition: "0.4s",
                    "&:hover": { boxShadow: "0px 15px 30px rgba(0,0,0,0.3)" }
                  }}>
                    <CardMedia component="img" height="260" image={property.image} alt={property.title} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" fontWeight="bold">{property.title}</Typography>
                      <Typography variant="body2"><LocationOn fontSize="small" /> {property.address}</Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
                        <AttachMoney fontSize="small" /> ₹{property.price.toLocaleString()}
                      </Typography>
                      <Typography variant="body2"><Home fontSize="small" /> 📏 Size: {property.size} sqft</Typography>
                      <Typography variant="body2"><CheckCircle fontSize="small" /> 🏅 Ranking: {property.ranking_score} / 10</Typography>

                      <Box mt={2}>
                        <Tooltip title="AI Score">
                          <Typography variant="body2" fontWeight="bold">🧠 AI Score: {aiScore}%</Typography>
                        </Tooltip>
                        <LinearProgress variant="determinate" value={aiScore} sx={{ height: 8, borderRadius: 5, bgcolor: "#E0E0E0" }} />
                      </Box>

                      {/* 🧠 AI Insights */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>🧠 Insights:</Typography>
                        {Array.isArray(insights) ? (
                          insights.map((item, i) => (
                            <Typography key={i} variant="body2" sx={{ color: "#424242", fontStyle: "italic" ,fontWeight: 700 }}>
                              • {item}
                            </Typography>
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: "#212121", fontWeight: 700, fontStyle: "italic" }}>{insights}</Typography>

                        )}
                      </Box>

                      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => navigate(viewUrl)}>
                        🔍 View Property
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default ComparePage;
