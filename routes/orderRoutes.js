const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, orderController.createOrder);
router.get('/user', verifyToken, orderController.getUserOrders);
router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateOrderStatus);
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.get('/:id', verifyToken, orderController.getOrderById);

module.exports = router;