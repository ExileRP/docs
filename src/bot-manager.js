/**
 * Bot Manager
 * Manages multiple bots in parallel
 */

const chalk = require('chalk');
const BotInstance = require('./bot-instance');
const { generateNickname } = require('./nickname-generator');
const { getAllBots } = require('./data-storage');

class BotManager {
  constructor(config) {
    this.config = config;
    this.bots = [];
  }

  /**
   * Starts the specified number of bots
   */
  async start() {
    console.log(chalk.bold.cyan('\n=== Minecraft Bot Manager ===\n'));
    console.log(chalk.cyan(`Server: ${this.config.server.host}:${this.config.server.port}`));
    console.log(chalk.cyan(`Bot count: ${this.config.botCount}`));
    console.log(chalk.cyan(`Owner: ${this.config.owner || 'Not set'}\n`));

    const existingBots = getAllBots();
    const nicknames = [];

    // Reuse existing bot accounts first
    for (let i = 0; i < Math.min(this.config.botCount, existingBots.length); i++) {
      nicknames.push(existingBots[i].nickname);
    }

    // Generate new nicknames if needed
    while (nicknames.length < this.config.botCount) {
      nicknames.push(generateNickname());
    }

    console.log(chalk.green('Starting bots...\n'));

    // Start all bots with a delay between each
    for (let i = 0; i < nicknames.length; i++) {
      const nickname = nicknames[i];
      const bot = new BotInstance(this.config, nickname);
      this.bots.push(bot);
      
      bot.connect();
      
      // Add delay between bot connections to avoid rate limiting
      if (i < nicknames.length - 1) {
        await this.delay(this.config.connectDelay || 1000);
      }
    }

    console.log(chalk.green(`\n✓ All ${this.bots.length} bots started!\n`));
  }

  /**
   * Stops all bots
   */
  stop() {
    console.log(chalk.yellow('\nStopping all bots...'));
    
    this.bots.forEach(bot => {
      bot.disconnect();
    });
    
    this.bots = [];
    console.log(chalk.green('✓ All bots stopped\n'));
  }

  /**
   * Gets active bot count
   */
  getActiveBotCount() {
    return this.bots.filter(bot => bot.isActive).length;
  }

  /**
   * Gets bot statistics
   */
  getStats() {
    const total = this.bots.length;
    const active = this.getActiveBotCount();
    const inactive = total - active;
    
    return {
      total,
      active,
      inactive
    };
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = BotManager;
