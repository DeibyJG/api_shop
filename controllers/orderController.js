const Order = require('../models/order');

// Crear un pedido (cliente)
exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order({ ...req.body, userId: req.user.id });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pedidos del cliente autenticado
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar estado del pedido (solo admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los pedidos (solo admin)
exports.getAllOrders = async (req, res) => {
  try {
    // populate nos permite traer la información del usuario vinculado al pedido
    const orders = await Order.find().populate('userId', 'name email phone');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener detalle de un pedido
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email phone address');
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    
    // Verificamos que el pedido pertenezca al usuario que lo solicita, a menos que sea admin
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para ver este pedido' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};