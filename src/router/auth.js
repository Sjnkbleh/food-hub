import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post(
  '/register',
  [
    // Validate the input
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number and one special character'),
  ],
  async (req, res) => {
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    const { username, email, password } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 12); // Hash the password

      const result = await User.create({ email, password: hashedPassword, username }); // Create the user

      const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Create a token

      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' }); // Set the token in a cookie
      res.status(201).json({ result }); 
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' }); 
    }
  }
);

// Login
router.post(
  '/login',
  [
    // Validate the input
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      const existingUser = await User.findOne({ email });
      if (!existingUser) return res.status(400).json({ message: 'Invalid credentials' }); 

      // Check if the password is correct
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Create a token

      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' }); // Set the token in a cookie
      res.status(200).json({ result: existingUser });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
);

export default router;
