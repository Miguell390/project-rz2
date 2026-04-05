const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');

// Create (POST) a new Judge
router.post('/add-judge', async (req, res) => {
    try {
        const { name, username, contactNumber, email, password } = req.body;

        // Check if judge already exists
        const existingJudge = await Judge.findOne({ $or: [{ username }, { email }] });
        if (existingJudge) {
            return res.status(400).json({ message: "Username or Email already in use" });
        }

        const newJudge = new Judge({
            name,
            username,
            contactNumber,
            email,
            password
        });

        await newJudge.save();
        res.status(201).json({ message: "Judge created successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read (GET) all judges
router.get('/all-judges', async (req, res) => {
    try {
        const judges = await Judge.find().select('-password'); // Exclude passwords for safety
        res.status(200).json(judges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;