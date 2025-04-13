// agentController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllAgents = async (req, res) => {
    try {
        const agents = await prisma.agent.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json(agents);
    } catch (error) {
        console.error("Error fetching agents:", error);
        res.status(500).json({ message: 'Failed to fetch agents' });
    }
};

export const getAgentById = async (req, res) => {
    try {
        const { id } = req.params;

        const agent = await prisma.agent.findUnique({
            where: {
                id: id
            }
        });

        if (!agent) {
            return res.status(404).json({ message: "Agent not found" });
        }

        res.status(200).json(agent);
    } catch (error) {
        console.error("Error fetching agent by ID:", error);
        res.status(500).json({ message: "Error fetching agent details" });
    }
};
