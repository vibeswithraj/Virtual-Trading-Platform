import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getPortfolio } from '../controllers/portfolioController.js';

const router = Router();

router.get('/', authMiddleware, getPortfolio);

export default router;
