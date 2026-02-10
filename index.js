#!/usr/bin/env node

/**
 * Minecraft Bot System
 * Main entry point
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const BotManager = require('./src/bot-manager');

// Load configuration
const CONFIG_FILE = path.join(__dirname, 'config.json');

if (!fs.existsSync(CONFIG_FILE)) {
  console.error(chalk.red('Error: config.json not found!'));
  console.log(chalk.yellow('Please create a config.json file. See README.md for details.'));
  process.exit(1);
}

let config;
try {
  config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
} catch (error) {
  console.error(chalk.red('Error reading config.json:'), error.message);
  process.exit(1);
}

// Validate configuration
if (!config.server || !config.server.host || !config.server.port) {
  console.error(chalk.red('Error: Invalid server configuration in config.json'));
  process.exit(1);
}

if (!config.botCount || config.botCount < 1) {
  console.error(chalk.red('Error: botCount must be at least 1'));
  process.exit(1);
}

// Create bot manager
const manager = new BotManager(config);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nReceived SIGINT, shutting down gracefully...'));
  manager.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n\nReceived SIGTERM, shutting down gracefully...'));
  manager.stop();
  process.exit(0);
});

// Start the bot manager
(async () => {
  try {
    await manager.start();
    
    // Display statistics every 30 seconds
    setInterval(() => {
      const stats = manager.getStats();
      console.log(chalk.blue(`[Stats] Total: ${stats.total}, Active: ${stats.active}, Inactive: ${stats.inactive}`));
    }, 30000);
    
  } catch (error) {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  }
})();
