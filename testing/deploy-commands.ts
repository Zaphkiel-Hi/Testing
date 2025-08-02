// deploy-commands.ts

import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

config();

const commands: any[] = [];
const foldersPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = require(filePath).default;
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
      { body: commands },
    );

    console.log(`Successfully reloaded ${(data as any[]).length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
