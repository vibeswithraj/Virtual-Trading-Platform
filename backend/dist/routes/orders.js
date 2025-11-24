import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { placeOrder, listOrders } from '../controllers/ordersController.js';
const router = Router();
router.post('/', authMiddleware, placeOrder);
router.get('/', authMiddleware, listOrders);
export default router;
