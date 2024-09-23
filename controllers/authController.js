const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendVerificationEmail = require('../services/emailService');

const generateToken = (id, secret, expiresIn) => {
    return jwt.sign({ id }, secret, { expiresIn });
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verificationToken = crypto.randomBytes(20).toString('hex');
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiry: Date.now() + 3600000 // Token expires in 1 hour
        });
        // verificationTokenExpiry: Date.now() + 15000 
        await newUser.save();
        await sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({ msg: 'User registered. Check your email for verification instructions.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ 
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() } // Check token expiry
        });

        if (!user) {
            await User.deleteOne({ verificationToken: token });
            return res.status(400).json({ msg: 'Invalid or expired token. Please try again.' });
        }

        user.is_verified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ msg: 'Email verified successfully. You can now log in.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.is_verified) {
            return res.status(400).json({ msg: 'Invalid credentials or unverified email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const accessToken = "Bearer " + generateToken(user.id, process.env.JWT_SECRET, '15m');
        const refreshToken = "Bearer " + generateToken(user.id, process.env.JWT_REFRESH_SECRET, '7d');

        // Optionally store the refresh token in the database or a Redis store
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return res.status(401).json({ msg: 'No refresh token provided' });
        }

        const token = refreshToken.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ msg: 'Invalid refresh token' }); 
        }

        const newAccessToken = "Bearer " + generateToken(user.id, process.env.JWT_SECRET, '15m');
        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error('Refresh token error:', err);
        res.status(403).json({ msg: 'Invalid refresh token' });
    }
};

module.exports = {
    registerUser,
    verifyEmail,
    loginUser,
    refreshAccessToken
};
