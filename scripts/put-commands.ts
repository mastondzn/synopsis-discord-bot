import { REST } from '@discordjs/rest';
import type {
    APIApplicationCommand,
    APIPartialGuild,
    APIUser,
} from 'discord-api-types/v10';
import { Routes } from 'discord-api-types/v10';

import { commands } from '../src/discord/command-collection';
import { makeWinstonLogger } from '../src/utils/logger/logger';

const isValidUserResponse = (response: unknown): response is APIUser => {
    if (typeof response !== 'object') {
        return false;
    }

    if (response === null) {
        return false;
    }

    if (!('id' in response)) {
        return false;
    }

    return true;
};

const isValidGuildResponse = (
    response: unknown,
): response is APIPartialGuild[] => {
    if (Array.isArray(response)) {
        return response.every(
            (guild) =>
                typeof guild === 'object' && 'id' in guild && 'name' in guild,
        );
    }
    return false;
};

const isValidApplicationCommands = (
    response: unknown,
): response is APIApplicationCommand[] => {
    if (!Array.isArray(response)) {
        return false;
    }

    return response.every((command) => {
        if (typeof command !== 'object') {
            return false;
        }

        if (command === null) {
            return false;
        }

        if (!('name' in command)) {
            return false;
        }

        return true;
    });
};

const isGithubAction = !!process.env.GITHUB_ACTIONS;

const winstonLogger = isGithubAction
    ? null
    : makeWinstonLogger({ fileNameBase: 'script' });

const logger = isGithubAction ? console.log : winstonLogger?.info;

const errorLogger = isGithubAction ? console.error : winstonLogger?.error;

if (!logger || !errorLogger)
    // this will never throw, its simply to please typescript
    throw new Error('lol');

const putCommands = async (token: string, index: number) => {
    const rest = new REST({ version: '10' }).setToken(token);

    logger(`[I${index}] Attempting to get bot user...`);
    const bot = await rest.get(Routes.user());

    if (!isValidUserResponse(bot))
        throw new TypeError('Invalid user response.');

    logger(
        `[I${index}] Got bot user. ${bot.username}#${bot.discriminator}(${bot.id})`,
    );

    logger(`[I${index}] Attempting to get guilds...`);
    const guilds = await rest.get(Routes.userGuilds());

    if (!isValidGuildResponse(guilds))
        throw new TypeError('Invalid guilds response.');
    logger(`[I${index}] Got ${guilds.length} guilds.`);

    const commandsAsRawData = commands.map((command) => command.data.toJSON());

    logger(
        `[I${index}] Deploying data of ${commandsAsRawData.length} commands... `,
    );

    // we could not await in this loop, it would make it faster, but maybe in the future we could hit rate limits so leaving this for now
    for (const guild of guilds) {
        const response = await rest.put(
            Routes.applicationGuildCommands(bot.id, guild.id),
            {
                body: commandsAsRawData,
            },
        );

        if (!isValidApplicationCommands(response)) {
            throw new TypeError('Invalid application commands response.');
        }

        logger(
            `[I${index}] Successfully put commands for guild ${guild.name}(${guild.id}) for ${response.length} commands.`,
        );
    }

    logger(
        `[I${index}] Succesfully deployed command data to all guilds for bot ${bot.username}.`,
    );
};

void (async () => {
    const includesStaging =
        process.argv.includes('staging') ||
        process.argv.includes('dev') ||
        process.argv.includes('development');

    const includesProduction =
        process.argv.includes('prod') || process.argv.includes('production');

    if (
        includesProduction &&
        typeof process.env?.DISCORD_BOT_AUTH !== 'string'
    ) {
        throw new Error('DISCORD_BOT_AUTH environment variable is not set.');
    }

    if (includesStaging && typeof process.env?.DISCORD_BOT_AUTH !== 'string') {
        throw new Error(
            'DISCORD_BOT_STAGING_AUTH environment variable is not set.',
        );
    }

    if (isGithubAction) logger('Script running in GitHub actions.');

    const tokens: string[] = [];

    if (includesProduction) {
        tokens.push(process.env.DISCORD_BOT_AUTH);
    }
    if (includesStaging) {
        tokens.push(process.env.DISCORD_BOT_STAGING_AUTH);
    }

    logger(`Deploying with ${tokens.length} tokens.`);

    const promises = tokens.map((token, index) =>
        putCommands(token, index + 1),
    );
    await Promise.all(promises);
})();

process.on('uncaughtException', (error) => {
    console.log(error);
    errorLogger(error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.log(error);
    errorLogger(error);
    process.exit(1);
});
