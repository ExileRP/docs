/**
 * Authentication Handler
 * Handles bot registration and login on Minecraft server
 */

const chalk = require('chalk');
const { generateRandomString } = require('./nickname-generator');
const { findBot, saveBot } = require('./data-storage');

/**
 * Generates a random password
 * @returns {string} Random password
 */
function generatePassword() {
  return generateRandomString(12);
}

/**
 * Gets or creates bot credentials
 * @param {string} nickname - Bot nickname
 * @returns {Object} Object with nickname and password
 */
function getOrCreateCredentials(nickname) {
  const existingBot = findBot(nickname);
  
  if (existingBot) {
    console.log(chalk.blue(`[Auth] Using existing account for ${nickname}`));
    return {
      nickname: existingBot.nickname,
      password: existingBot.password,
      isNew: false
    };
  }
  
  const password = generatePassword();
  saveBot(nickname, password);
  console.log(chalk.green(`[Auth] Created new account for ${nickname}`));
  
  return {
    nickname,
    password,
    isNew: true
  };
}

/**
 * Handles authentication for a bot
 * @param {Object} bot - Mineflayer bot instance
 * @param {Object} credentials - Bot credentials
 */
async function handleAuthentication(bot, credentials) {
  return new Promise((resolve, reject) => {
    let authenticated = false;
    let timeout;

    const cleanup = () => {
      clearTimeout(timeout);
      bot.removeListener('message', messageHandler);
    };

    const messageHandler = (jsonMsg) => {
      const message = jsonMsg.toString();
      
      if (message.includes('register') && message.includes('password') && credentials.isNew) {
        console.log(chalk.yellow(`[${credentials.nickname}] Registering...`));
        bot.chat(`/register ${credentials.password} ${credentials.password}`);
      } else if (message.includes('login') && message.includes('password') && !credentials.isNew) {
        console.log(chalk.yellow(`[${credentials.nickname}] Logging in...`));
        bot.chat(`/login ${credentials.password}`);
      } else if (message.includes('successfully') || message.includes('logged in') || message.includes('registered')) {
        authenticated = true;
        console.log(chalk.green(`[${credentials.nickname}] Authentication successful!`));
        cleanup();
        resolve();
      }
    };

    bot.on('message', messageHandler);

    timeout = setTimeout(() => {
      if (!authenticated) {
        cleanup();
        console.log(chalk.yellow(`[${credentials.nickname}] Authentication timeout, assuming success`));
        resolve();
      }
    }, 10000);
  });
}

module.exports = {
  generatePassword,
  getOrCreateCredentials,
  handleAuthentication
};
