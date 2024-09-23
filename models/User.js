const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/, // Regex to validate email format
    },
    is_verified: {
        type: Boolean,
        default: false, // Initially set to false until email verification is completed
    },
    verificationToken: {
        type: String,
    },
    verificationTokenExpiry: {
        type: Date,
    },
    refreshToken: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
