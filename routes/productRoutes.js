const express = require('express');
const { getProducts, getProductById, addReview, addComment, getRelatedProducts } = require('../controllers/productController');

const router = express.Router();
    
router.get('/', getProducts);

router.get('/:productId', getProductById);

router.post('/:productId/review', addReview);

router.post('/:productId/comment', addComment);

// API lấy sản phẩm liên quan
router.get('/:productId/related', getRelatedProducts);

module.exports = router;