const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { decrypt, testEncryptionDecryption , encrypt} = require('../services/cryptoService');
const router = express.Router();

// Route that requires authentication
router.get('/profile', protect, async (req, res) => {
    try {
        
        const user = req.user;
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        // Ensure email is defined before decrypting
        if (user.email) {
            user.email = encrypt(user.email);
            
        } else {
            console.warn('User email is undefined');
        }

        res.json({ user });
    } catch (err) {
        console.error('Error in /profile route:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
