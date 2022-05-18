import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';

import type { BotCommand, CommandResult } from '../../utils/types';

export const pongCommand: BotCommand = {
    data: new SlashCommandBuilder()
        .setName('pong')
        .setDescription('Ephermally responds with Ping!')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),

    run: async (bot, interaction) => {
        const result: CommandResult = {
            content: 'Ping!',
            ephemeral: true,
        };

        // probably do these last 2 lines always in a command
        await interaction.reply(result);
        return result;
    },
};
