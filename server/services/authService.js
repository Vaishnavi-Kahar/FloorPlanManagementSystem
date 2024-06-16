require("dotenv").config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET
exports.registerUser = async ({ name, password }) => {
  let user = await User.findOne({ name });
  if (user) throw new Error('User already exists');

  user = new User({ name, password });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  const payload = { user: { id: user.id } };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

exports.loginUser = async ({ name, password }) => {
  const user = await User.findOne({ name });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const payload = { user: { id: user.id } };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
