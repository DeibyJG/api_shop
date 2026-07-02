const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Obtener todos los usuarios (solo admin)
router.get('/', verifyToken, verifyAdmin, authController.getUsers);

// Obtener detalle de usuario (solo admin)
router.get('/:id', verifyToken, verifyAdmin, authController.getUserById);

module.exports = router;