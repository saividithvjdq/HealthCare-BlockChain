const crypto = require('crypto');
const config = require('../config/keys');

// Encryption key and IV
const ENCRYPTION_KEY = config.ENCRYPTION_KEY || 'your-fallback-encryption-key-32-chars';
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypt data
 * @param {string|object} data - Data to encrypt (string or object)
 * @returns {string} - Encrypted data as base64 string
 */
exports.encryptData = (data) => {
  try {
    // Convert objects to string
    const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
    
    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher using AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Encrypt the data
    let encrypted = cipher.update(dataString, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Return IV + encrypted data as base64
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data
 * @param {string} encryptedData - Encrypted data (IV:data format)
 * @returns {string|object} - Decrypted data, parsed as JSON if possible
 */
exports.decryptData = (encryptedData) => {
  try {
    // Split IV and data
    const parts = encryptedData.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted data format');
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    // Create decipher
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    
    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    // Try to parse as JSON if possible
    try {
      return JSON.parse(decrypted);
    } catch (e) {
      // Return as string if not valid JSON
      return decrypted;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash data (one-way)
 * @param {string} data - Data to hash
 * @returns {string} - Hashed data
 */
exports.hashData = (data) => {
  return crypto
    .createHash('sha256')
    .update(String(data))
    .digest('hex');
};

/**
 * Compare a plain value with a hash
 * @param {string} plainValue - Plain text value
 * @param {string} hashedValue - Hashed value to compare against
 * @returns {boolean} - True if hash matches
 */
exports.compareHash = (plainValue, hashedValue) => {
  return exports.hashData(plainValue) === hashedValue;
}; 