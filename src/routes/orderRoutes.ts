
import express from 'express';
import { createOrder, getOrders, getOrdersByEmail } from '../controllers/orderController';

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/by-email', getOrdersByEmail);

export default router;
