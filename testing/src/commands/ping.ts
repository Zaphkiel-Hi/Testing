import { Message } from 'discord.js';

export default {
  name: 'ping',
  description: 'Replies with Pong!',
  async execute(message: Message) {
    await message.reply('🏓 Pong!');
  }
};
