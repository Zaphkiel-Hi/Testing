// src/types.d.ts

import { Collection } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, {
      data: SlashCommandBuilder;
      execute: Function;
    }>;
  }
}
