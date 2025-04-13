import express from "express";
import { createResidency, getAllResidencies, getResidency, rankResidencies, getRankedResidencies } from "../controllers/resdCntrl.js";
import jwtCheck from "../config/auth0Config.js";

const router = express.Router();

// ✅ Create a residency (automatically triggers AI ranking)
router.post("/create", jwtCheck, createResidency);

// ✅ Fetch all residencies (default sorting)
router.get("/allresd", getAllResidencies);

// ✅ Fetch AI-ranked properties (Sorted by `ranking_score`)
router.get("/ranked", getRankedResidencies); // ✅ FIXED: Uses the correct controller function

// ✅ Fetch a single residency by ID
router.get("/:id", getResidency);

// ✅ Manually trigger AI ranking (if needed)
router.post("/rank", rankResidencies);

export { router as residencyRoute };
