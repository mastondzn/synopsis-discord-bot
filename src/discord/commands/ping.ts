import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';

import type { BotCommand, CommandResult } from '../../utils/types';

export const pingCommand: BotCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Responds with Pong')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    run: async (bot, interaction) => {
        const latency = bot.client.ws.ping;

        const result: CommandResult = {
            content: `${interaction.user.toString()} pong! (${latency}ms)`,
        };

        // probably do these last 2 lines always in a command
        await interaction.reply(result);
        return result;
    },
};
