// controllers/authController.js

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const crypto = require('crypto'); // Import the crypto module
const sendVerificationEmail = require('../services/emailService');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user with the same email exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        // Create a new user instance
        user = new User({
            username,
            email,
            password
        });

        // Hash the password before saving to database
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Generate a verification token
        const token = crypto.randomBytes(20).toString('hex');
        user.verificationToken = token;

        // Save user to database
        await user.save();

        // Send verification email
        await sendVerificationEmail(user.email, user.verificationToken);

        res.status(201).json({ msg: 'User registered. Check your email for verification instructions.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        // Find user by verification token
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token. Please try again.' });
        }

        // Update user's verification status
        user.is_verified = true;
        user.verificationToken = undefined;
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
        console.log(`Login attempt for email: ${email}`);

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log(`User with email ${email} found`);

        // Check if user is verified
        if (!user.is_verified) {
            console.log(`User with email ${email} is not verified`);
            return res.status(400).json({ msg: 'Please verify your email first' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Incorrect password for email: ${email}`);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        console.log(`User with email ${email} logged in successfully`);

        // Generate JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error(`Error generating JWT for email: ${email}`, err);
                    throw err;
                }
                console.log(`JWT generated successfully for email: ${email}`);
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(`Error logging in user with email: ${email}`, err);
        res.status(500).send('Server Error');
    }
};


// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         // Check if user exists
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         // Check if user is verified
//         if (!user.is_verified) {
//             return res.status(400).json({ msg: 'Please verify your email first' });
//         }

//         // Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid credentials' });
//         }

//         // Generate JWT
//         const payload = {
//             user: {
//                 id: user.id
//             }
//         };

//         jwt.sign(
//             payload,
//             process.env.JWT_SECRET, // Use JWT_SECRET from environment variables
//             { expiresIn: '1h' }, // Token expires in 1 hour
//             (err, token) => {
//                 if (err) throw err;
//                 res.json({ token });
//             }
//         );
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

module.exports = {
    registerUser,
    verifyEmail,
    loginUser
}
