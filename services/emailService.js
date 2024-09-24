// services/emailService.js

const nodemailer = require('nodemailer');
require("dotenv").config()

const transporter = nodemailer.createTransport({
    // Configure your email service here
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS,
    }
});

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    try {
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Email Address',
            html: `Please click this link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a>`
        });
    } catch (error) {
        console.error(`Error sending verification email: ${error.message}`);
    }
};

module.exports = sendVerificationEmail;
