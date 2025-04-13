// routes/agentRoutes.js
import express from 'express';
import { getAllAgents, getAgentById } from '../controllers/agentController.js';

const router = express.Router();

router.get('/', getAllAgents);
router.get('/:id', getAgentById);

export default router;