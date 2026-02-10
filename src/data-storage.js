/**
 * Data Storage Module
 * Handles reading and writing bot data to/from JSON file
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const DATA_DIR = path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'bots-data.json');

/**
 * Ensures the data directory and file exist
 */
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ bots: [] }, null, 2));
  }
}

/**
 * Loads bot data from JSON file
 * @returns {Object} Bot data object with bots array
 */
function loadData() {
  ensureDataFile();
  
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red('Error loading data:'), error.message);
    return { bots: [] };
  }
}

/**
 * Saves bot data to JSON file
 * @param {Object} data - Bot data object to save
 */
function saveData(data) {
  ensureDataFile();
  
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(chalk.red('Error saving data:'), error.message);
  }
}

/**
 * Finds a bot by nickname
 * @param {string} nickname - Bot nickname to find
 * @returns {Object|null} Bot object or null if not found
 */
function findBot(nickname) {
  const data = loadData();
  return data.bots.find(bot => bot.nickname === nickname) || null;
}

/**
 * Adds or updates a bot in the database
 * @param {string} nickname - Bot nickname
 * @param {string} password - Bot password
 */
function saveBot(nickname, password) {
  const data = loadData();
  const existingIndex = data.bots.findIndex(bot => bot.nickname === nickname);
  
  const botData = {
    nickname,
    password,
    registeredAt: new Date().toISOString()
  };
  
  if (existingIndex !== -1) {
    data.bots[existingIndex] = botData;
  } else {
    data.bots.push(botData);
  }
  
  saveData(data);
}

/**
 * Gets all saved bots
 * @returns {Array} Array of bot objects
 */
function getAllBots() {
  const data = loadData();
  return data.bots || [];
}

module.exports = {
  loadData,
  saveData,
  findBot,
  saveBot,
  getAllBots
};
