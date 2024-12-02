const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderConroller');

// Route tạo đơn hàng mới
router.post('/', OrderController.createOrder);

// Route lấy tất cả đơn hàng của người dùng
router.get('/:userId', OrderController.getOrders);

// Route cập nhật trạng thái đơn hàng
router.put('/:orderId/status', OrderController.updateOrderStatus);

// Route xóa đơn hàng
router.delete('/:orderId', OrderController.deleteOrder);

module.exports = router;
