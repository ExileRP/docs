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
  const charsLength = chars.length;
  let result = '';
  
  // Use rejection sampling to avoid modulo bias
  const randomValues = new Uint8Array(length);
  crypto.randomFillSync(randomValues);
  
  for (let i = 0; i < length; i++) {
    // Rejection sampling: keep regenerating if value would cause bias
    let randomValue = randomValues[i];
    const threshold = 256 - (256 % charsLength);
    
    // If we get a biased value, get a new random byte
    while (randomValue >= threshold) {
      crypto.randomFillSync(randomValues, i, 1);
      randomValue = randomValues[i];
    }
    
    result += chars[randomValue % charsLength];
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
