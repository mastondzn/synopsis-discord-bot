import type { SlashCommandBuilder } from '@discordjs/builders';
import type { CommandInteraction, MessageEmbed } from 'discord.js';

import type { Synopsisbot } from '../../client';

export interface CommandResultWithTextOnly {
    content: string;
    ephemeral?: boolean;
}

export interface CommandResultWithEmbedsOnly {
    embeds: ReturnType<typeof MessageEmbed.prototype.toJSON>[];
    ephemeral?: boolean;
}

export interface CommandResultWithTextAndEmbeds {
    embeds: ReturnType<typeof MessageEmbed.prototype.toJSON>[];
    content: string;
    ephemeral?: boolean;
}
export type CommandResult =
    | CommandResultWithTextOnly
    | CommandResultWithEmbedsOnly
    | CommandResultWithTextAndEmbeds;

export interface BotCommand {
    data: SlashCommandBuilder;

    run: (
        bot: Synopsisbot,
        interaction: CommandInteraction,
    ) => Promise<CommandResult>;
}
