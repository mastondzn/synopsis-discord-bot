import {
    CommandError,
    SuccessfulCommand,
    UnexpectedCommandError,
    UserCommandError,
} from '../../db/entitites';
import { exclamationEmoji } from '../../utils/constants';
import { UserError } from '../../utils/errors';
import type { CommandResult, EventHandler } from '../../utils/types';

export const handleCommands: EventHandler = {
    name: 'handleCommands',
    event: 'interactionCreate',
    exec: async (bot, interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName, user, channel, guild } = interaction;

        const command = bot.commands.get(commandName);
        if (!command) return;

        const { logger, orm } = bot;

        let commandExecutionResult: CommandResult | undefined;
        let commandExecutionError: Error | UserError | unknown | undefined;

        try {
            commandExecutionResult = await command.run(bot, interaction);
        } catch (error) {
            commandExecutionError = error;
        }

        const em = orm.em.fork();

        const userAsString = `${user.username}#${user.discriminator}(${user.id})`;
        const interactionWasInAChannel = channel !== null;
        const interactionWasInAGuild = guild !== null;
        const guildAsString = interactionWasInAGuild
            ? `${guild.name}(${guild.id})`
            : 'no guild';
        const channelAsString = interactionWasInAChannel
            ? channel.id
            : 'no channel';

        if (typeof commandExecutionResult === 'object') {
            logger.info(
                `User ${userAsString} ran command ${commandName} (in guild ${guildAsString}, in channel ${channelAsString}) ...`,
            );
            logger.info(commandExecutionResult);

            await em.persistAndFlush(
                new SuccessfulCommand(interaction, commandExecutionResult),
            );
        }

        if (commandExecutionError instanceof UserError) {
            logger.error(
                `User ${userAsString} tried to run a command but made an error in doing so: ${commandExecutionError.message} (in guild ${guildAsString}, in channel ${channelAsString}) ...`,
            );
            logger.error(commandExecutionError);

            await Promise.all([
                interaction.reply({
                    content: `${exclamationEmoji} ${user.toString()} you've made an error while trying to use this command: ${
                        commandExecutionError.message
                    }`,
                }),
                em.persistAndFlush(
                    new UserCommandError(interaction, commandExecutionError),
                ),
            ]);
        } else if (commandExecutionError instanceof Error) {
            logger.error(
                `User ${userAsString} tried to run a command but it has error'd in the process: ${commandExecutionError.message} (in guild ${guildAsString}, in channel ${channelAsString}) ...`,
            );
            logger.error(commandExecutionError);

            await Promise.all([
                interaction.reply({
                    content: `${exclamationEmoji} ${user.toString()} you've made an error while trying to use this command: ${
                        commandExecutionError.message
                    }`,
                }),
                em.persistAndFlush(
                    new CommandError(interaction, commandExecutionError),
                ),
            ]);
        } else if (typeof commandExecutionError !== 'undefined') {
            logger.error(
                `User ${userAsString} tried to run a command but an unexpected error has occured in the process. (in guild ${guildAsString}, in channel ${channelAsString}) ...`,
            );
            logger.error(commandExecutionError);

            await Promise.all([
                interaction.reply({
                    content: `${exclamationEmoji} ${user.toString()} an unexpected error has occured while running this command.`,
                }),
                em.persistAndFlush(
                    new UnexpectedCommandError(
                        interaction,
                        commandExecutionError,
                    ),
                ),
            ]);
        }
    },
};
