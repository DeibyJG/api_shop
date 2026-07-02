const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', productController.getProducts);

router.post('/', verifyToken, verifyAdmin, productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', verifyToken, verifyAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, productController.deleteProduct);

module.exports = router;