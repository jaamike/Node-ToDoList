// const crypto = require('crypto');

// // Generate a 32-byte key and convert it to a hexadecimal string
// const key = crypto.randomBytes(16).toString('hex');

// // Print the generated key to the console
// console.log('Generated key:', key);

// const crypto = require('crypto');
// require('dotenv').config();
// // Ensure your environment variable is set correctly
// const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
// const iv = Buffer.alloc(16, 0); // Initialization vector (IV) for AES-256-CBC

// // Encryption function
// const encrypt = (text) => {
//     const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     return encrypted;
// };

// // Decryption function
// const decrypt = (text) => {
//     if (!text) {
//         throw new Error('No text provided for decryption');
//     }
//     try {
//         const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
//         let decrypted = decipher.update(text, 'hex', 'utf8');
//         decrypted += decipher.final('utf8');
//         return decrypted;
//     } catch (err) {
//         console.error('Decryption error:', err);
//         throw new Error('Decryption failed');
//     }
// };

// // Test encryption and decryption
// const testEncryptionDecryption = () => {
//     const originalText = 'Hello, World!';
//     const encryptedText = encrypt(originalText);
//     console.log('Encrypted Text:', encryptedText);

//     try {
//         const decryptedText = decrypt(encryptedText);
//         console.log('Decrypted Text:', decryptedText);
//     } catch (error) {
//         console.error('Error during decryption:', error);
//     }
// };

// testEncryptionDecryption();

// module.exports = { encrypt, decrypt };


const crypto = require('crypto');
require('dotenv').config();
// Ensure that the ENCRYPTION_KEY is a 32-byte (256-bit) key
const secretKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const iv = Buffer.alloc(16, 0); // This IV must be the same for both encryption and decryption

// Encryption function
const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log('encrypted', encrypted);
    
    decrypt(encrypted); // For testing purposes
    return encrypted;
};

// Decryption function
const decrypt = (text) => {
    if (!text) {
        throw new Error('No text provided for decryption');
    }
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log('decrypted', decrypted);
        return decrypted;
    } catch (err) {
        console.error('Decryption error:', err);
        throw new Error('Decryption failed');
    }
};

// Example usage
const encryptedText = encrypt('myemail@example.com');
const decryptedText = decrypt(encryptedText);

console.log('Final decrypted text:', decryptedText);
