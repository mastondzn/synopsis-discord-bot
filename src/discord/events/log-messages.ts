import type { EventHandler } from '../../utils/types';

export const logMessages: EventHandler = {
    name: 'logMessages',
    event: 'messageCreate',
    exec: (bot, message) => {
        const { logger } = bot;
        const { author, channel, content, embeds } = message;
        const { type: channelType, id: channelId } = channel;

        const authorAsString = `${author.username}#${author.discriminator}<${author.id}>`;

        let channelAsString: string;
        if (channelType === 'DM') {
            channelAsString = `DM[${channelId}]`;
        } else if (channelType.includes('THREAD')) {
            channelAsString = `THRD[${channelId}]`;
        } else if (channelType.includes('GUILD')) {
            channelAsString = `GLD[${channelId}]`;
        } else {
            channelAsString = `FAIL_TO_PARSE[${channelId}]`;
        }

        const hasContent = content?.length > 0;
        const hasEmbeds = embeds?.length > 0;

        logger.info(
            `${channelAsString} - ${authorAsString} :: ${
                hasContent ? content : 'NO_CONTENT'
            } ${hasEmbeds ? '(HAS_EMBEDS)' : ''}`.trim(),
        );
    },
};
