const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar cliente
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ name, email, password: hashedPassword, phone, address, role: 'cliente' });
    await newUser.save();
    res.status(201).json({ message: 'Cliente registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Registrar administrador (solo admin)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ name, email, password: hashedPassword, phone, address, role: 'admin' });
    await newUser.save();
    res.status(201).json({ message: 'Administrador registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios (solo admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Excluimos la contraseña por seguridad
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, role: user.role, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener detalle de usuario (solo admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};