import express from 'express';
import {
	createProduct,
	createProductReview,
	deleteProduct,
	getProductById,
	getProducts,
	updateProduct,
	getTopProducts
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/top', getTopProducts);
router.post('/', protect, isAdmin, createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);
router.post('/:id/review', protect, createProductReview);

export default router;
