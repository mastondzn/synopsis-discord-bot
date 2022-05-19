import { Routes } from 'discord-api-types/v10';

import { Synopsisbot } from '../src/client';
import { commands } from '../src/discord/command-collection';

void (async () => {
    const bot = new Synopsisbot({
        isInAScriptContext: true,
    });
    await bot.initialize();
    const { logger, client, discordRest: rest, orm, redis } = bot;

    logger.info('Attempting to send commands to Discord API...');

    const commandsAsRawData = commands.map((command) => command.data.toJSON());

    logger.info('Getting the guilds the bot is currently in...');
    const guilds = await client.guilds.fetch();

    logger.info(`Getting current bot id...`);
    const clientId = client.user?.id;
    if (!clientId) {
        logger.error(new Error('Could not get client id.'));
        return;
    }

    for (const [, guild] of guilds) {
        const { id: guildId, name: guildName } = guild;
        logger.info(
            `Attempting to put commands in guild ${guildName}(${guildId})`,
        );

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commandsAsRawData,
        });

        logger.info(
            `Successfully put commands in guild ${guildName}(${guildId})`,
        );
    }

    logger.info('Successfully sent commands to the Discord API!');

    client.destroy();
    redis.disconnect();
    await orm.close();
})();
