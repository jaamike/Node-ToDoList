const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationTokenSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to the User model
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    expires: '1h' // Token expires after 1 hour
  }
});

// Export the model
module.exports = mongoose.model('VerificationToken', verificationTokenSchema);
