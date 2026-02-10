/**
 * Nickname Generator for Minecraft Bots
 * Generates unique bot nicknames in format: Bot_XYZ123
 */

const crypto = require('crypto');

/**
 * Generates a random alphanumeric string
 * @param {number} length - Length of the random string
 * @returns {string} Random string
 */
function generateRandomString(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  
  return result;
}

/**
 * Generates a unique bot nickname
 * @returns {string} Bot nickname in format Bot_XYZ123
 */
function generateNickname() {
  const randomPart = generateRandomString(6);
  return `Bot_${randomPart}`;
}

module.exports = {
  generateNickname,
  generateRandomString
};
