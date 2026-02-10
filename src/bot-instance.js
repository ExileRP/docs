/**
 * Bot Instance
 * Individual bot implementation with mineflayer
 */

const mineflayer = require('mineflayer');
const chalk = require('chalk');
const { getOrCreateCredentials, handleAuthentication } = require('./auth-handler');

class BotInstance {
  constructor(config, nickname) {
    this.config = config;
    this.nickname = nickname;
    this.bot = null;
    this.credentials = null;
    this.isActive = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Creates and connects the bot
   */
  async connect() {
    try {
      this.credentials = getOrCreateCredentials(this.nickname);
      
      console.log(chalk.cyan(`[${this.nickname}] Connecting to ${this.config.server.host}:${this.config.server.port}...`));
      
      this.bot = mineflayer.createBot({
        host: this.config.server.host,
        port: this.config.server.port,
        username: this.credentials.nickname,
        version: this.config.server.version || false
      });

      this.setupEventHandlers();
      this.isActive = true;
    } catch (error) {
      console.error(chalk.red(`[${this.nickname}] Connection error:`), error.message);
      this.handleReconnect();
    }
  }

  /**
   * Sets up bot event handlers
   */
  setupEventHandlers() {
    this.bot.on('login', () => {
      console.log(chalk.green(`[${this.nickname}] Logged into server`));
    });

    this.bot.on('spawn', async () => {
      console.log(chalk.green(`[${this.nickname}] Spawned in game`));
      await handleAuthentication(this.bot, this.credentials);
      this.setupGameHandlers();
    });

    this.bot.on('error', (err) => {
      console.error(chalk.red(`[${this.nickname}] Error:`), err.message);
    });

    this.bot.on('kicked', (reason) => {
      console.log(chalk.red(`[${this.nickname}] Kicked:`), reason);
      this.handleReconnect();
    });

    this.bot.on('end', () => {
      console.log(chalk.yellow(`[${this.nickname}] Disconnected`));
      this.handleReconnect();
    });

    this.bot.on('death', () => {
      console.log(chalk.red(`[${this.nickname}] Died, respawning...`));
      this.bot.chat('/respawn');
    });
  }

  /**
   * Sets up in-game command handlers
   */
  setupGameHandlers() {
    this.bot.on('chat', (username, message) => {
      if (username === this.bot.username) return;

      const isOwner = this.config.owner && username === this.config.owner;
      
      if (message.startsWith(`${this.nickname} `)) {
        const command = message.substring(this.nickname.length + 1).trim();
        this.handleCommand(username, command, isOwner);
      }
    });
  }

  /**
   * Handles in-game commands
   */
  handleCommand(username, command, isOwner) {
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();

    switch (cmd) {
      case 'stats':
        this.sendStats();
        break;
      
      case 'tp':
      case 'teleport':
        if (isOwner) {
          this.teleportToPlayer(username);
        } else {
          this.bot.chat('Only the owner can use this command');
        }
        break;
      
      case 'drop':
        if (isOwner && parts.length > 1) {
          this.dropItems(parts[1]);
        }
        break;
      
      case 'ping':
        this.bot.chat(`Pong! Hello ${username}`);
        break;
      
      case 'help':
        this.bot.chat('Commands: stats, ping, help, tp (owner), drop (owner)');
        break;
      
      default:
        this.bot.chat(`Unknown command: ${cmd}. Type 'help' for commands.`);
    }
  }

  /**
   * Sends bot statistics
   */
  sendStats() {
    const health = this.bot.health;
    const food = this.bot.food;
    const pos = this.bot.entity.position;
    
    this.bot.chat(`Stats: Health ${health}/20, Food ${food}/20, Pos (${Math.floor(pos.x)}, ${Math.floor(pos.y)}, ${Math.floor(pos.z)})`);
  }

  /**
   * Teleports bot to a player
   */
  teleportToPlayer(playerName) {
    try {
      this.bot.chat(`/tp ${this.nickname} ${playerName}`);
      console.log(chalk.blue(`[${this.nickname}] Attempting to teleport to ${playerName}`));
    } catch (error) {
      console.error(chalk.red(`[${this.nickname}] Teleport error:`), error.message);
    }
  }

  /**
   * Drops items from inventory
   */
  async dropItems(itemName) {
    try {
      const items = this.bot.inventory.items();
      const item = items.find(i => i.name.includes(itemName));
      
      if (item) {
        await this.bot.tossStack(item);
        this.bot.chat(`Dropped ${item.count}x ${item.name}`);
      } else {
        this.bot.chat(`I don't have any ${itemName}`);
      }
    } catch (error) {
      console.error(chalk.red(`[${this.nickname}] Drop error:`), error.message);
    }
  }

  /**
   * Handles reconnection logic
   */
  handleReconnect() {
    if (!this.config.autoReconnect || !this.isActive) {
      return;
    }

    this.reconnectAttempts++;
    
    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      console.log(chalk.red(`[${this.nickname}] Max reconnect attempts reached, giving up`));
      this.isActive = false;
      return;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, capped at 30s
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
    console.log(chalk.yellow(`[${this.nickname}] Reconnecting in ${delay / 1000}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`));
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Disconnects the bot
   */
  disconnect() {
    this.isActive = false;
    if (this.bot) {
      this.bot.quit();
    }
  }
}

module.exports = BotInstance;
