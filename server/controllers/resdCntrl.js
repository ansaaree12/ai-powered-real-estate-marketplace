import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";
import { exec } from "child_process";

// Create Residency (Add New Apartment)
export const createResidency = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        price,
        address,
        country,
        city,
        facilities,
        image,
        userEmail,
        size,
        TypeofHouse
    } = req.body.data;

    console.log(req.body.data);
    try {
        const residency = await prisma.residency.create({
            data: {
                title,
                description,
                price,
                address,
                country,
                city,
                facilities,
                image,
                size,
                TypeofHouse,
                owner: { connect: { email: userEmail } },
            },
        });

        // Automatically trigger AI ranking after adding a new residency
        exec("python rank_properties.py", (error, stdout, stderr) => {
            if (error) {
                console.error(`AI ranking error: ${error.message}`);
            } else {
                console.log("AI ranking updated:", stdout);
            }
        });

        res.send({ message: "Residency created successfully!", residency });
    } catch (err) {
        if (err.code === "p2002") {
            throw new Error("A residency with this address already exists");
        }
        throw new Error(err.message);
    }
});

// Get All Residencies (Ranked by AI)
export const getAllResidencies = asyncHandler(async (req, res) => {
    const residencies = await prisma.residency.findMany({
        orderBy: { ranking_score: "desc" }, // AI-ranked order
        take: parseInt(req.query.limit) || 35, // Limit results
    });
    res.send(residencies);
});

// Get Single Residency by ID
export const getResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const residency = await prisma.residency.findUnique({ where: { id } });
        res.send(residency);
    } catch (err) {
        throw new Error(err.message);
    }
});

// Manually Trigger AI Ranking
export const rankResidencies = asyncHandler(async (req, res) => {
    exec("python rank_properties.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running AI model: ${error.message}`);
            res.status(500).json({ success: false, message: "AI ranking failed" });
        } else {
            console.log("AI ranking updated:", stdout);
            res.status(200).json({ success: true, message: "AI ranking complete" });
        }
    });
});

// ✅ Fetch AI-ranked residencies (Sorted by `ranking_score`)
export const getRankedResidencies = asyncHandler(async (req, res) => {
    try {
        const rankedResidencies = await prisma.residency.findMany({
            orderBy: { ranking_score: "desc" }, // ✅ Sort by ranking_score
            take: 50, // ✅ Limit results for performance
        });

        res.json(rankedResidencies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ranked residencies", error });
    }
});

