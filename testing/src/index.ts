import { Client, GatewayIntentBits, Collection } from 'discord.js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env' });

// Define prefix
const PREFIX = '!';

// Initialize Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // needed to read text messages
  ],
});

// Initialize command collection
client.commands = new Collection();

// Dynamically load all command files from /commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if (command.default?.name && command.default?.execute) {
    client.commands.set(command.default.name, command.default);
  }
}

// Bot ready event
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

// Handle text commands (prefix-based)
client.on('messageCreate', async message => {
  // Ignore bots and messages without prefix
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  // Parse command and args
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  // Find and execute the command
  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Error executing command.');
  }
});
console.log("Loaded Token:", process.env.DISCORD_TOKEN);

client.login(process.env.DISCORD_TOKEN);
