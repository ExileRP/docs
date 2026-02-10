#!/usr/bin/env node

/**
 * Test script for Minecraft Bot System
 * Tests basic functionality without connecting to a server
 */

console.log('🧪 Testing Minecraft Bot System Components\n');

// Test 1: Nickname Generator
console.log('1️⃣  Testing Nickname Generator...');
const { generateNickname, generateRandomString } = require('./src/nickname-generator');
const nicknames = [];
for (let i = 0; i < 5; i++) {
  const nick = generateNickname();
  nicknames.push(nick);
  console.log(`   Generated: ${nick}`);
}
console.log('   ✅ Nickname generator works!\n');

// Test 2: Data Storage
console.log('2️⃣  Testing Data Storage...');
const { saveBot, findBot, getAllBots } = require('./src/data-storage');
const testNick = 'TestBot_' + generateRandomString(6);
const testPass = generateRandomString(12);
console.log(`   Saving bot: ${testNick}`);
saveBot(testNick, testPass);
const foundBot = findBot(testNick);
if (foundBot && foundBot.nickname === testNick && foundBot.password === testPass) {
  console.log('   ✅ Data storage works!');
  console.log(`   Found bot: ${foundBot.nickname} (password hidden)\n`);
} else {
  console.log('   ❌ Data storage failed!\n');
  process.exit(1);
}

// Test 3: Auth Handler
console.log('3️⃣  Testing Auth Handler...');
const { generatePassword, getOrCreateCredentials } = require('./src/auth-handler');
const password = generatePassword();
console.log(`   Generated password length: ${password.length}`);
const credentials = getOrCreateCredentials(testNick);
if (credentials.nickname === testNick && !credentials.isNew) {
  console.log('   ✅ Auth handler works!');
  console.log(`   Retrieved existing credentials for: ${credentials.nickname}\n`);
} else {
  console.log('   ❌ Auth handler failed!\n');
  process.exit(1);
}

// Test 4: Bot Manager (without connection)
console.log('4️⃣  Testing Bot Manager initialization...');
const BotManager = require('./src/bot-manager');
const testConfig = {
  server: { host: 'localhost', port: 25565 },
  botCount: 3,
  owner: 'TestOwner',
  autoReconnect: true,
  connectDelay: 1000
};
const manager = new BotManager(testConfig);
const stats = manager.getStats();
console.log(`   Manager initialized with config`);
console.log(`   Stats: ${JSON.stringify(stats)}`);
console.log('   ✅ Bot Manager works!\n');

// Test 5: Bot Instance (without connection)
console.log('5️⃣  Testing Bot Instance initialization...');
const BotInstance = require('./src/bot-instance');
const botInstance = new BotInstance(testConfig, 'TestBot_XYZ123');
console.log(`   Bot instance created: ${botInstance.nickname}`);
console.log(`   Is active: ${botInstance.isActive}`);
console.log('   ✅ Bot Instance works!\n');

console.log('🎉 All tests passed!');
console.log('\n📝 Note: These are basic tests. To fully test the system,');
console.log('   you need to run it against a Minecraft server with:');
console.log('   npm run bots\n');
