const crypto = require('crypto');
require('dotenv').config();

const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

// Encryption function with random IV
const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Generate a random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted data
    const ivHex = iv.toString('hex');
    return ivHex + encrypted; // Return IV + ciphertext
};

// Decryption function
const decrypt = (encryptedText) => {
    const iv = Buffer.from(encryptedText.slice(0, 32), 'hex'); // Extract the IV
    const encryptedData = encryptedText.slice(32); // Get the ciphertext
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = { encrypt, decrypt };
