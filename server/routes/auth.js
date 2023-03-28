const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

router.get('/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  });
  

module.exports = router;
