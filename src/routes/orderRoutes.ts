import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController';
import { protect } from '../middleware/protect';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);

export default router;
