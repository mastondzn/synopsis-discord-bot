import { SlashCommandBuilder } from '@discordjs/builders';
import { Formatters, MessageEmbed } from 'discord.js';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import prettyMilliseconds from 'pretty-ms';

import { UserError } from '../../utils/errors';
import type { BotCommand, CommandResult } from '../../utils/types';

export const userInfoCommand: BotCommand = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Returns some info about a discord guild member.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user to get info about.')
                .setRequired(false),
        )
        .setDMPermission(false),

    run: async (bot, interaction) => {
        if (!interaction.inGuild() || !interaction.guild)
            throw new Error('Interaction is not in a guild.');

        const { guild, options } = interaction;
        let { user } = interaction;

        const wantedUser = options.getUser('user');
        if (wantedUser) {
            user = wantedUser;
        }
        const member = await guild.members.fetch(user);

        const userJoinedGuildAt = member.joinedAt;
        const userCreatedAt = user.createdAt;
        const guildCreatedAt = guild.createdAt;

        if (!userJoinedGuildAt) {
            throw new UserError(
                'This user does not seem to be in the guild currently.',
            );
        }

        const prettyDifferenceSinceUserJoinedGuild = prettyMilliseconds(
            Date.now() - userJoinedGuildAt.getTime(),
        );

        const differenceSinceAccountCreated =
            Date.now() - userCreatedAt.getTime();
        const prettyDifferenceSinceAccountCreated = prettyMilliseconds(
            differenceSinceAccountCreated,
        );

        const differenceSinceGuildCreatedTillUserJoined =
            userJoinedGuildAt.getTime() - guildCreatedAt.getTime();
        const prettyDifferenceSinceGuildCreatedTillUserJoined =
            prettyMilliseconds(differenceSinceGuildCreatedTillUserJoined);

        const localeOptions: Parameters<typeof Date.prototype.toLocaleString> =
            ['en-US', { timeZone: 'UTC' }];
        const lines = [
            `Joined server at: ${Formatters.bold(
                userJoinedGuildAt.toLocaleString(...localeOptions),
            )}`,
            `Account created at: ${Formatters.bold(
                userCreatedAt.toLocaleString(...localeOptions),
            )}`,
            ``,
            `Time since account created: ${Formatters.bold(
                prettyDifferenceSinceAccountCreated,
            )}`,
            `Time since joined server: ${Formatters.bold(
                prettyDifferenceSinceUserJoinedGuild,
            )}`,
            `Difference since server created till user joined: ${Formatters.bold(
                prettyDifferenceSinceGuildCreatedTillUserJoined,
            )}`,
            ``,
            `Highest role: ${Formatters.bold(member.roles.highest.name)}`,
        ].join('\n');

        const embed = new MessageEmbed()
            .setColor(member.roles.highest.color || '#ffffff')
            .setTitle(`${member.user.tag}'s info`)
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription(lines);

        const result: CommandResult = {
            embeds: [embed.toJSON()],
        };

        // probably do these last 2 lines always in a command
        await interaction.reply(result);
        return result;
    },
};
