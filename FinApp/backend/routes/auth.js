const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to verify simple token/userId (Simplified for hackathon)
const verifyUser = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) return res.status(401).json({ message: 'No User ID provided' });
    req.userId = userId;
    next();
};

// Route: Save or Update User Profile (Onboarding)
router.post('/profile', verifyUser, async (req, res) => {
    try {
        const { personalInfo, jobDetails, incomeDetails } = req.body;

        // Find existing user or create a new one
        let user = await User.findOne({ userId: req.userId });

        if (user) {
            // Update existing user
            if (personalInfo) user.personalInfo = { ...user.personalInfo, ...personalInfo };
            if (jobDetails) user.jobDetails = { ...user.jobDetails, ...jobDetails };
            if (incomeDetails) user.incomeDetails = { ...user.incomeDetails, ...incomeDetails };
            await user.save();
            return res.status(200).json({ message: 'Profile updated successfully', user });
        } else {
            // Create new user
            user = new User({
                userId: req.userId,
                personalInfo,
                jobDetails,
                incomeDetails
            });
            await user.save();
            return res.status(201).json({ message: 'Profile created successfully', user });
        }
    } catch (err) {
        console.error('Profile Save Error:', err);
        res.status(500).json({ message: 'Server error saving profile', error: err.message });
    }
});

// Route: Get User Profile
router.get('/profile', verifyUser, async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.userId });
        if (!user) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Profile Fetch Error:', err);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

module.exports = router;
