import express from 'express';
import {
	addOrderItems,
	getAllOrders,
	getMyOrders,
	getOrderById,
	updateOrderToDelivered,
	updateOrderToPaid
} from '../controllers/orderController.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addOrderItems);
router.get('/', protect, isAdmin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/delivered', protect, isAdmin, updateOrderToDelivered);

export default router;
