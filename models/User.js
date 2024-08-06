const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
        trim: true // To remove leading and trailing spaces
    },
    password: {
        type: String,
        required: true,
        minlength: 8 // Ensure passwords are secure by setting a minimum length
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Regex to validate email format
    },
    is_verified: {
        type: Boolean,
        default: false // Initially set to false until email verification is completed
    },
    verificationToken: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
